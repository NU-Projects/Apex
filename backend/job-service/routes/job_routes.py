from flask import Blueprint, request
from controllers.job_controller import JobController

job_bp = Blueprint('jobs', __name__)
controller = JobController()


@job_bp.route('/extract-missing-skills', methods=['POST'])
def extract_missing_skills():
    return controller.extract_missing_skills(request.json)
