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
        skills = self.github_service.fetch_github_skills(username)
        return jsonify(skills)

    def get_linkedin_skills(self, data):
        username = data.get('username')
        skills = self.linkedin_service.fetch_linkedin_skills(username)
        return jsonify(skills)

    def get_all_skills(self, data):
        username = data.get('username')
        github_skills = self.github_service.fetch_github_skills(username)
        linkedin_skills = self.linkedin_service.fetch_linkedin_skills(username)
        combined = list(set(github_skills + linkedin_skills))
        return jsonify(combined)

    def add_skills_to_db(self, data):
        email = data.get('email')
        skills = data.get('skills', [])
        success = self.repository.update_user_skills(email, skills)
        if success:
            return jsonify({"message": "Skills updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update skills"}), 500
