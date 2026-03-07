import os
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

class LinkedinService:
    def __init__(self):
        self.token = os.getenv("APIFY_TOKEN")
        self.actor_id = os.getenv("LINKEDIN_PROFILE_ACTOR")

    def fetch_linkedin_skills(self, username):
        url = f"https://www.linkedin.com/in/{username}"
        run_url = f"https://api.apify.com/v2/acts/{self.actor_id}/run-sync-get-dataset-items?token={self.token}"
        
        payload = {
            "profileUrls": [url]
        }
        
        try:
            response = requests.post(run_url, json=payload, timeout=60)
            if response.status_code not in [200, 201]:
                return []
                
            data = response.json()
            if not data:
                return []
                
            profile = data[0]
            skills = profile.get("skills", [])
            return skills
        except:
            return []
