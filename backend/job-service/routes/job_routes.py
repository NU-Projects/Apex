from flask import Blueprint, request
from controllers.job_controller import JobController

job_bp = Blueprint('jobs', __name__)
controller = JobController()


@job_bp.route('/compatibility', methods=['POST'])
def compatibility():
    return controller.calculate_compatibility(request.json)
