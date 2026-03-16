from flask import jsonify
from services.job_service import JobService


class JobController:
    def __init__(self):
        self.job_service = JobService()

    def extract_missing_skills(self, data):
        data = data or {}
        limit = data.get("limit")

        if limit is not None:
            try:
                limit = int(limit)
                if limit <= 0:
                    return jsonify({"error": "limit must be a positive integer"}), 400
            except Exception:
                return jsonify({"error": "limit must be a positive integer"}), 400

        result = self.job_service.extract_and_save_missing_job_skills(limit=limit)
        return jsonify(result), 200

    def get_job_count(self, role):
        if not role:
            return jsonify({"error": "role parameter is required"}), 400
        count = self.job_service.get_job_count_by_role(role)
        return jsonify({"role": role, "count": count}), 200

    def get_role_insights(self, current_role, selected_role, skills=None):
        if not current_role or not selected_role:
            return jsonify({"error": "currentRole and selectedRole parameters are required"}), 400

        if skills is not None and not isinstance(skills, list):
            return jsonify({"error": "skills must be an array of strings"}), 400

        result = self.job_service.get_role_insights(current_role, selected_role, skills or [])
        return jsonify(result), 200
