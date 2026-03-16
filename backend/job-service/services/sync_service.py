import os
import json
import time
import requests
import threading
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

from repositories.job_repository import JobRepository
from utils.initial_jobs import collect_all_jobs, insert_jobs, FILENAME_TO_ROLE

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'), override=True)


class SyncService:
    def __init__(self):
        self.repository = JobRepository()
        self.apify_token = os.getenv("APIFY_TOKEN", "")
        self.linkedin_actor = os.getenv("LINKEDIN_JOB_SCRAPPER_ACTOR", "bebity~linkedin-jobs-scraper")
        self.indeed_actor = os.getenv("INDEED_JOB_SCRAPPER_ACTOR", "borderline~indeed-scraper")
        
        self.backend_dir = Path(__file__).resolve().parent.parent.parent
        self.scrapped_dir = self.backend_dir / "scrapped_jobs"
        
        self.lookup_interval_hours = 24
        self.time_expiration_days = 7

        self.linkedin_actor = self.linkedin_actor.replace("/", "~")
        self.indeed_actor = self.indeed_actor.replace("/", "~")

    def check_and_sync(self, time_expiration_days=None):
        """
        Checks if the newest record in the DB is older than time_expiration_days.
        Returns basic status quickly. If sync is needed, kicks it off in the background.
        """
        if time_expiration_days is None:
            time_expiration_days = self.time_expiration_days
            
        last_date = self.repository.get_latest_job_created_at()
        
        needs_sync = False
        if not last_date:
            print("[SyncService] No jobs found in database. Sync required.")
            needs_sync = True
        else:
            if last_date.tzinfo is None:
                last_date = last_date.replace(tzinfo=timezone.utc)
            
            diff = datetime.now(timezone.utc) - last_date
            print(f"[SyncService] Latest job was created {diff.days} days ago. (Expiration set to {time_expiration_days} days)")
            
            if diff.days >= time_expiration_days:
                needs_sync = True
                print(f"[SyncService] Jobs are older than expiration threshold ({time_expiration_days} days). Sync required.")
            else:
                print(f"[SyncService] Jobs are still within the expiration window. Skipping sync.")
                
        if needs_sync:
            print("[SyncService] Triggering background synchronization (This will result in truncating the old jobs table)...")
            threading.Thread(target=self._run_sync_task, daemon=True).start()
            return {"message": f"Sync started in background.", "synced": True}
            
        return {"message": "Jobs are up to date.", "synced": False}

    def _run_sync_task(self):
        print("[SyncService] Starting Apify scrapers...")
        
        for file_key, role_title in FILENAME_TO_ROLE.items():
            self._scrape_linkedin(file_key, role_title, "united_states", 10)
            self._scrape_linkedin(file_key, role_title, "pakistan", 20)
            
            self._scrape_indeed(file_key, role_title, "united_states", 10)
            self._scrape_indeed(file_key, role_title, "pakistan", 20)
            
        print("[SyncService] All scrapers finished. Truncating and loading into database...")
        jobs = collect_all_jobs()
        if jobs:
            insert_jobs(jobs, truncate=True)
            print(f"[SyncService] Inserted {len(jobs)} jobs successfully.")
        else:
            print("[SyncService] No jobs found to insert after scraping.")

    def _start_apify_run(self, actor_id, input_data):
        url = f"https://api.apify.com/v2/acts/{actor_id}/runs?token={self.apify_token}"
        headers = {"Content-Type": "application/json"}
        try:
            print(f"      -> Starting actor {actor_id}...")
            res = requests.post(url, headers=headers, json=input_data, timeout=30)
            res.raise_for_status()
            run_data = res.json().get("data", {})
            print(f"      -> Actor started successfully. Run ID: {run_data.get('id')}")
            return run_data
        except Exception as e:
            print(f"Failed to start actor {actor_id}: {e}")
            return {}

    def _wait_for_run(self, run_id):
        url = f"https://api.apify.com/v2/actor-runs/{run_id}?token={self.apify_token}"
        print(f"      -> Waiting for run {run_id} to finish...")
        while True:
            try:
                res = requests.get(url, timeout=30)
                res.raise_for_status()
                data = res.json().get("data", {})
                status = data.get("status")
                
                print(f"         Status: {status}")
                if status == "SUCCEEDED":
                    return data
                elif status in ["FAILED", "ABORTED", "TIMED-OUT"]:
                    print(f"Run {run_id} failed with status: {status}")
                    return None
                    
            except Exception as e:
                print(f"Error checking run {run_id}: {e}")
                
            time.sleep(10)

    def _fetch_dataset(self, dataset_id):
        url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={self.apify_token}"
        print(f"      -> Fetching dataset {dataset_id}...")
        try:
            res = requests.get(url, timeout=60)
            res.raise_for_status()
            items = res.json()
            print(f"      -> Fetched {len(items)} items from dataset.")
            return items
        except Exception as e:
            print(f"Failed to fetch dataset {dataset_id}: {e}")
            return []

    def _save_to_json(self, platform, file_key, country, items):
        if not items:
            return
            
        dir_path = self.scrapped_dir / country / platform
        dir_path.mkdir(parents=True, exist_ok=True)
        
        file_path = dir_path / f"{file_key}.json"
        
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(items, f, indent=4)
        except Exception as e:
            print(f"Failed to write JSON {file_path}: {e}")

    def _scrape_linkedin(self, file_key, role_title, country_folder, limit):
        print(f"Scraping LinkedIn | Country: {country_folder} | Role: {role_title}")
        country_name = country_folder.replace("_", " ")

        input_data = {
            "location": country_name,
            "proxy": {
                "useApifyProxy": True,
                "apifyProxyGroups": ["RESIDENTIAL"]
            },
            "rows": limit,
            "title": role_title,
            "publishedAt": ""
        }

        run = self._start_apify_run(self.linkedin_actor, input_data)
        if not run:
            return
            
        finished_run = self._wait_for_run(run.get("id"))
        if not finished_run:
            return
            
        dataset_id = finished_run.get("defaultDatasetId")
        if dataset_id:
            items = self._fetch_dataset(dataset_id)
            self._save_to_json("linkedin", file_key, country_folder, items)
            print(f"      -> Saved {len(items)} jobs for LinkedIn | {role_title} | {country_folder}")


    def _scrape_indeed(self, file_key, role_title, country_folder, limit):
        print(f"Scraping Indeed | Country: {country_folder} | Role: {role_title}")
        country_code = "pk" if "pakistan" in country_folder.lower() else "us"
        
        input_data = {
            "country": country_code,
            "enableUniqueJobs": False,
            "includeSimilarJobs": False,
            "maxRows": limit,
            "query": role_title
        }

        run = self._start_apify_run(self.indeed_actor, input_data)
        if not run:
            return
            
        finished_run = self._wait_for_run(run.get("id"))
        if not finished_run:
            return
            
        dataset_id = finished_run.get("defaultDatasetId")
        if dataset_id:
            items = self._fetch_dataset(dataset_id)
            self._save_to_json("indeed", file_key, country_folder, items)
            print(f"      -> Saved {len(items)} jobs for Indeed | {role_title} | {country_folder}")
