"""
initial_jobs.py
Reads all JSON files from scrapped_jobs/ directory, cleans data,
and inserts into the 'jobs' table in Supabase (PostgreSQL).

Usage:
    python scripts/initial_jobs.py
"""
import os
import json
import re
import html
import psycopg2
import requests
from dotenv import load_dotenv
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / "./../.env")

DATABASE_URL = os.getenv("DATABASE_URL")
SCRAPPED_JOBS_DIR = BACKEND_DIR / "../scrapped_jobs"

FILENAME_TO_ROLE = {
    "ai_ml":              "AI/ML Engineer",
    "backend":            "Backend Engineer",
    "frontend":           "Frontend Engineer",
    "full_stack":         "Full Stack Engineer",
    "devops":             "DevOps Engineer",
    "data_engineer":      "Data Engineer",
    "data_scientist":     "Data Scientist",
    "data_scientists":    "Data Scientist",
    "software_engineer":  "Software Engineer",
    "mobile_dev_engineer": "Mobile Engineer",
    "qa_engineer":        "QA Engineer",
    "cyber_eng":          "Cybersecurity Engineer",
    "product_manager":    "Product Manager",
}

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama2")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "")

def call_ollama(messages):
    is_local = 'localhost' in OLLAMA_BASE_URL or '127.0.0.1' in OLLAMA_BASE_URL
    
    headers = {'Content-Type': 'application/json'}
    if OLLAMA_API_KEY and not is_local:
        headers['Authorization'] = f'Bearer {OLLAMA_API_KEY}'
    
    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
    }
    try:
        res = requests.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload, timeout=90)
        res.raise_for_status()
        data = res.json()
        return data.get("message", {}).get("content", "").strip()
    except Exception as e:
        print(f"  AI Error: {e}")
        return None

def extract_json_object(text):
    if not text: return None
    match = re.search(r"\{[\s\S]*\}", text)
    if not match: return None
    try:
        return json.loads(match.group(0))
    except:
        return None

def normalize_locations_for_jobs(jobs):
    """Group jobs by country, find unique locations, and normalize them using AI."""
    by_country = {}
    for job in jobs:
        c = job.get("country", "Unknown")
        if c not in by_country: by_country[c] = []
        by_country[c].append(job)

    for country, country_jobs in by_country.items():
        raw_locations = list(set(j["location"] for j in country_jobs if j.get("location")))
        if not raw_locations: continue

        print(f"  Normalizing {len(raw_locations)} unique locations for {country}...")
        
        # Process in batches of 50 to avoid prompt size limits
        batch_size = 50
        mapping = {}
        for i in range(0, len(raw_locations), batch_size):
            batch = raw_locations[i:i+batch_size]
            prompt = (
                f"Normalize the following job location strings into their primary major city in {country}. "
                f"Group sub-areas and variations into their main city name (e.g., 'Johar Town', 'Johar Town, Punjab', 'Lahore, Punjab' all map to 'Lahore'). "
                f"If it's a generic country like '{country}' or 'Remote', map it to '{country}'. "
                f"Return ONLY a strictly valid JSON object mapping every exact raw location string to its normalized city name."
                f"\n\nLocations:\n{json.dumps(batch)}"
            )
            
            content = call_ollama([
                {"role": "system", "content": "You are a data cleaner. Respond ONLY with a valid JSON object."},
                {"role": "user", "content": prompt}
            ])
            
            batch_mapping = extract_json_object(content)
            if batch_mapping:
                mapping.update(batch_mapping)

        # Apply mapping
        for job in country_jobs:
            raw = job.get("location")
            if raw in mapping:
                job["normalized_location"] = str(mapping[raw]).strip().title()
            else:
                job["normalized_location"] = raw.strip().title() if raw else None

from typing import Optional

def clean_text(text: Optional[str]) -> Optional[str]:
    if not text:
        return None
    
    # 1. Unescape HTML entities (e.g., &amp; -> &)
    text = html.unescape(text)
    
    # 2. Remove HTML tags if any
    text = re.sub(r"<[^>]+>", "", text)
    
    # 3. Standardize newlines and remove '*' which are often used for messy bolding in scraped text
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("*", "")
    
    # 4. Clean each line individually to preserve structure but remove trailing junk
    lines = [line.rstrip() for line in text.split("\n")]
    
    # 5. Remove excessive newlines (keep max 1 empty line between text blocks)
    cleaned_lines = []
    prev_was_empty = False
    for line in lines:
        if not line.strip():
            if not prev_was_empty:
                cleaned_lines.append("")
                prev_was_empty = True
        else:
            cleaned_lines.append(line)
            prev_was_empty = False
            
    text = "\n".join(cleaned_lines)
    
    # 6. Final trim
    return text.strip() if text.strip() else None


def clean_title(title: Optional[str]) -> Optional[str]:
    if not title:
        return None
    title = html.unescape(title)
    title = title.replace("*", "")                  
    title = title.strip()
    return title if title else None


def parse_linkedin_job(job: dict, country_folder: str, role: str) -> dict:
    location_raw = job.get("location", "")

    country = None
    if location_raw:
        parts = [p.strip() for p in location_raw.split(",")]
        if len(parts) >= 1:
            country = parts[-1]

    if not country:
        country = country_folder.replace("_", " ").title()

    return {
        "platform": "linkedin",
        "role": role,
        "title": clean_title(job.get("title")),
        "company_name": clean_text(job.get("companyName")),
        "description": clean_text(job.get("description")),
        "url": job.get("jobUrl"),
        "location": clean_text(location_raw) if location_raw else None,
        "experience_level": clean_text(job.get("experienceLevel")),
        "contract_type": clean_text(job.get("contractType")),
        "country": clean_text(country),
    }


def parse_indeed_job(job: dict, country_folder: str, role: str) -> dict:
    loc = job.get("location", {})

    if isinstance(loc, dict):
        location_str = loc.get("formattedAddressLong") or loc.get("city") or None
        country = loc.get("country")
    else:
        location_str = str(loc) if loc else None
        country = None

    if not country:
        country = country_folder.replace("_", " ").title()

    job_types = job.get("jobType") or job.get("attributes") or []
    contract_type = ", ".join(job_types) if job_types else None

    return {
        "platform": "indeed",
        "role": role,
        "title": clean_title(job.get("title")),
        "company_name": clean_text(job.get("companyName")),
        "description": clean_text(job.get("descriptionText")),
        "url": job.get("jobUrl"),
        "location": clean_text(location_str),
        "experience_level": None,  
        "contract_type": clean_text(contract_type),
        "country": clean_text(country),
    }


def collect_all_jobs() -> list:
    all_jobs = []

    if not SCRAPPED_JOBS_DIR.exists():
        print(f"ERROR: Directory not found: {SCRAPPED_JOBS_DIR}")
        return all_jobs

    for country_folder in sorted(SCRAPPED_JOBS_DIR.iterdir()):
        if not country_folder.is_dir():
            continue
        country_name = country_folder.name  

        for platform_folder in sorted(country_folder.iterdir()):
            if not platform_folder.is_dir():
                continue
            platform = platform_folder.name  

            for json_file in sorted(platform_folder.glob("*.json")):
                try:
                    with open(json_file, "r", encoding="utf-8") as f:
                        data = json.load(f)
                except (json.JSONDecodeError, UnicodeDecodeError) as e:
                    print(f"  Skipping {json_file.name}: {e}")
                    continue

                if not isinstance(data, list):
                    data = [data]

                file_key = json_file.stem
                role = FILENAME_TO_ROLE.get(file_key, "Other")
                parser = parse_linkedin_job if platform == "linkedin" else parse_indeed_job

                for raw_job in data:
                    parsed = parser(raw_job, country_name, role)

                    if not parsed["title"]:
                        continue

                    all_jobs.append(parsed)

                print(f"  {platform}/{country_name}/{json_file.name} [{role}] -> {len(data)} jobs")

    return all_jobs


def insert_jobs(jobs: list, truncate: bool = False):
    if not jobs:
        print("No jobs to insert.")
        return

    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        if truncate:
            print("Truncating jobs table...")
            cur.execute("TRUNCATE TABLE jobs RESTART IDENTITY;")

        insert_sql = """
            INSERT INTO jobs (platform, role, title, company_name, description,
                              url, location, normalized_location, experience_level, contract_type, country)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (url) DO UPDATE SET
                role = EXCLUDED.role,
                title = EXCLUDED.title,
                company_name = EXCLUDED.company_name,
                description = EXCLUDED.description,
                location = EXCLUDED.location,
                normalized_location = EXCLUDED.normalized_location,
                experience_level = EXCLUDED.experience_level,
                contract_type = EXCLUDED.contract_type,
                country = EXCLUDED.country;
        """

        inserted = 0
        skipped = 0
        seen_urls = set()

        for job in jobs:
            url = job.get("url")
            if url and url in seen_urls:
                skipped += 1
                continue
            if url:
                seen_urls.add(url)

            cur.execute(insert_sql, (
                job["platform"],
                job["role"],
                job["title"],
                job["company_name"],
                job["description"],
                job["url"],
                job["location"],
                job.get("normalized_location"),
                job["experience_level"],
                job["contract_type"],
                job["country"],
            ))
            inserted += 1

        conn.commit()
        cur.close()

        print(f"\n{'-'*50}")
        print(f"  Total parsed:    {len(jobs)}")
        print(f"  Inserted:        {inserted}")
        print(f"  Duplicates:      {skipped}")
        print(f"{'-'*50}")

    except Exception as e:
        print(f"Database error: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()


def main():
    print("-" * 50)
    print("  INITIAL JOBS LOADER")
    print("-" * 50)
    print(f"Source: {SCRAPPED_JOBS_DIR}")
    print(f"Database: {'*' * 20}...{DATABASE_URL[-20:] if DATABASE_URL else 'NOT SET'}")
    print()

    if not DATABASE_URL:
        print("ERROR: DATABASE_URL is not set in .env")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute("""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname = 'jobs_url_unique'
                ) THEN
                    ALTER TABLE jobs ADD CONSTRAINT jobs_url_unique UNIQUE (url);
                END IF;
            END
            $$;
        """)
        conn.commit()
        cur.close()
        conn.close()
        print("Unique constraint on jobs.url\n")
    except Exception as e:
        print(f"Could not add unique constraint (may already exist): {e}\n")

    print("Scanning JSON files...\n")
    jobs = collect_all_jobs()

    print(f"\nTotal jobs collected: {len(jobs)}\n")

    if jobs:
        print(f"Normalizing {len(jobs)} jobs (AI categorization)...")
        normalize_locations_for_jobs(jobs)
        
        print("Inserting into database...")
        insert_jobs(jobs, truncate=True)
    else:
        print("No jobs found to insert.")

    print("\nDone!")


if __name__ == "__main__":
    main()
