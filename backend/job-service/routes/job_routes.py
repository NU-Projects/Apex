from flask import Blueprint, request
from controllers.job_controller import JobController

job_bp = Blueprint('jobs', __name__)
controller = JobController()


@job_bp.route('/count', methods=['GET'])
def get_job_count():
    role = request.args.get('role')
    return controller.get_job_count(role)

@job_bp.route('/insights', methods=['POST'])
def get_role_insights():
    data = request.json or {}
    current_role = data.get('currentRole')
    selected_role = data.get('selectedRole')
    skills = data.get('skills', [])
    return controller.get_role_insights(current_role, selected_role, skills)
@job_bp.route('/compatibility', methods=['POST'])
def compatibility():
    return controller.calculate_compatibility(request.json)
