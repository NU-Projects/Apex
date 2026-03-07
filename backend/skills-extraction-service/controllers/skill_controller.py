from services.github_service import GithubService
from services.linkedin_service import LinkedinService
from repositories.skill_repository import SkillRepository
from flask import jsonify

class SkillController:
    def __init__(self):
        self.github_service = GithubService()
        self.linkedin_service = LinkedinService()
        self.repository = SkillRepository()

    def get_github_skills(self, data):
        username = data.get('username')
        return jsonify(self.github_service.fetch_github_skills(username))

    def get_linkedin_skills(self, data):
        username = data.get('username')
        return jsonify(self.linkedin_service.fetch_linkedin_skills(username))

    def get_all_skills(self, data):
        github_username = data.get('github_username')
        linkedin_username = data.get('linkedin_username')
        
        github_username = None if str(github_username).lower() in ['none', 'null', ''] else github_username
        linkedin_username = None if str(linkedin_username).lower() in ['none', 'null', ''] else linkedin_username
        
        github = self.github_service.fetch_github_skills(github_username) if github_username else []
        linkedin = self.linkedin_service.fetch_linkedin_skills(linkedin_username) if linkedin_username else []
        
        return jsonify(sorted(list(set(github + linkedin))))

    def add_skills_to_db(self, data):
        success = self.repository.update_user_skills(data.get('email'), data.get('skills', []))
        if success:
            return jsonify({"message": "Skills updated successfully"}), 200
        return jsonify({"error": "Failed to update skills"}), 500
