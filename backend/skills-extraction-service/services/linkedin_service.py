import os
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

class LinkedinService:
    def __init__(self):
        self.li_at = os.getenv("LINKEDIN_LI_AT")
        self.jsessionid = os.getenv("LINKEDIN_JSESSIONID")

    def fetch_linkedin_skills(self, username):
        if not self.li_at or not self.jsessionid:
            print("Missing credentials in .env")
            return []

        li_at = self.li_at.strip().strip('"')
        jsessionid = self.jsessionid.strip().strip('"')

        url = f"https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity={username}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-89"
        
        headers = {
            "authority": "www.linkedin.com",
            "accept": "application/vnd.linkedin.normalized+json+2.1",
            "cookie": f'li_at={li_at}; JSESSIONID="{jsessionid}";',
            "csrf-token": jsessionid,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "x-restli-protocol-version": "2.0.0",
            "referer": f"https://www.linkedin.com/in/{username}/"
        }

        try:
            print(f"Fetching skills for: {username}")
            res = requests.get(url, headers=headers, timeout=15)
            
            if res.status_code == 401:
                print("Session Expired (401). Please update li_at in .env")
                return []
            
            if res.status_code != 200:
                print(f"Request failed with status {res.status_code}")
                return []

            data = res.json()
            skills = []
            for item in data.get("included", []):
                if item.get("$type") == "com.linkedin.voyager.dash.identity.profile.Skill":
                    name = item.get("name")
                    if name:
                        skills.append(name)

            final_skills = sorted(list(set([s for s in skills if s])))
            print(f"Extracted {len(final_skills)} skills")
            return final_skills

        except Exception as e:
            print(f"Error: {e}")
            return []
