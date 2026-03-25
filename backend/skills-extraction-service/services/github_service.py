import os
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

class GithubService:
    def __init__(self):
        self.token = os.getenv("GITHUB_ACCESS_TOKEN")

    def fetch_github_skills(self, username):
        if not self.token:
            print("Missing GITHUB_ACCESS_TOKEN in .env")
            return []

        headers = {"Authorization": f"token {self.token}"}
        url = f"https://api.github.com/users/{username}/repos?per_page=100"
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code != 200:
                print(f"GitHub fetch failed (Status {response.status_code})")
                return []

            skills = set()
            for repo in response.json():
                if repo.get("language"):
                    skills.add(repo.get("language"))
                for topic in repo.get("topics", []):
                    skills.add(topic)
                    
            return list(skills)
        except Exception as e:
            print(f"GitHub fetch error: {e}")
            return []
