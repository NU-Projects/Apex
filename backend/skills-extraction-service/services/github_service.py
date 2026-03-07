import os
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

class GithubService:
    def __init__(self):
        self.token = os.getenv("GITHUB_ACCESS_TOKEN")

    def fetch_github_skills(self, username):
        headers = {"Authorization": f"token {self.token}"}
        repos_url = f"https://api.github.com/users/{username}/repos"
        
        response = requests.get(repos_url, headers=headers)
        if response.status_code != 200:
            return []

        repos = response.json()
        skills = set()
        for repo in repos:
            if repo.get("language"):
                skills.add(repo.get("language"))
            topics = repo.get("topics", [])
            for topic in topics:
                skills.add(topic)
                
        return list(skills)
