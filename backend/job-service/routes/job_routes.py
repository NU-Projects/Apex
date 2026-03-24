from flask import Blueprint, request
from controllers.job_controller import JobController

job_bp = Blueprint('jobs', __name__)
controller = JobController()


@job_bp.route('/roles', methods=['GET'])
def get_distinct_roles():
    return controller.get_distinct_roles()

@job_bp.route('/count', methods=['GET'])
def get_job_count():
    role = request.args.get('role')
    return controller.get_job_count(role)

@job_bp.route('/by-role', methods=['POST'])
def get_jobs_by_role():
    data = request.json or {}
    role = (
        data.get('jobRole')
        or data.get('job_role')
        or data.get('job-Role')
        or data.get('role')
        or ''
    )
    role = str(role).strip()
    return controller.get_jobs_by_role(role)

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

@job_bp.route('/sync', methods=['POST', 'GET'])
def sync_jobs():
    return controller.sync_jobs()

@job_bp.route('/locations', methods=['GET'])
def get_location_counts():
    country = request.args.get('country')
    return controller.get_location_counts(country)

@job_bp.route('/normalize-locations', methods=['POST'])
def normalize_locations():
    return controller.normalize_locations(request.json)

@job_bp.route('/normalize-all-geographies', methods=['POST', 'GET'])
def normalize_all_geographies():
    return controller.normalize_all_jobs()
