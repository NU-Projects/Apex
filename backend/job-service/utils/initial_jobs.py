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
from dotenv import load_dotenv
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
SCRAPPED_JOBS_DIR = BACKEND_DIR / "scrapped_jobs"

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

def clean_text(text: str | None) -> str | None:
    if not text:
        return None
    text = html.unescape(text)                     
    text = re.sub(r"<[^>]+>", "", text)             
    text = text.replace("*", "")                    
    text = re.sub(r"\r\n", "\n", text)              
    text = re.sub(r"\n{3,}", "\n\n", text)          
    text = text.strip()
    return text if text else None


def clean_title(title: str | None) -> str | None:
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
        "skills": [],
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
        "skills": [],
        "url": job.get("jobUrl"),
        "location": clean_text(location_str),
        "experience_level": None,  
        "contract_type": clean_text(contract_type),
        "country": clean_text(country),
    }


def collect_all_jobs() -> list[dict]:
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


def insert_jobs(jobs: list[dict]):
    if not jobs:
        print("No jobs to insert.")
        return

    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        insert_sql = """
            INSERT INTO jobs (platform, role, title, company_name, description, skills,
                              url, location, experience_level, contract_type, country)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (url) DO UPDATE SET
                role = EXCLUDED.role,
                title = EXCLUDED.title,
                company_name = EXCLUDED.company_name,
                description = EXCLUDED.description,
                location = EXCLUDED.location,
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
                job["skills"],
                job["url"],
                job["location"],
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
        print("Inserting into database...")
        insert_jobs(jobs)
    else:
        print("No jobs found to insert.")

    print("\nDone!")


if __name__ == "__main__":
    main()
