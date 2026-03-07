from flask import Blueprint, request
from controllers.skill_controller import SkillController

skill_bp = Blueprint('skills', __name__)
controller = SkillController()

@skill_bp.route('/github-skills', methods=['POST'])
def github_skills():
    return controller.get_github_skills(request.json)

@skill_bp.route('/linkedin-skills', methods=['POST'])
def linkedin_skills():
    return controller.get_linkedin_skills(request.json)

@skill_bp.route('/all-skills', methods=['POST'])
def all_skills():
    return controller.get_all_skills(request.json)

@skill_bp.route('/save-skills', methods=['POST'])
def save_skills():
    return controller.add_skills_to_db(request.json)
