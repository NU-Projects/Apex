from flask import jsonify
from services.job_service import JobService


class JobController:
    def __init__(self):
        self.job_service = JobService()

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

    def calculate_compatibility(self, data):
        data = data or {}
        skills = data.get("skills", [])
        job_title = (data.get("job_title") or "").strip()
        job_description = (data.get("job_description") or "").strip()

        if not isinstance(skills, list):
            return jsonify({"error": "skills must be an array of strings"}), 400

        if not job_title:
            return jsonify({"error": "job_title is required"}), 400

        if not job_description:
            return jsonify({"error": "job_description is required"}), 400

        try:
            result = self.job_service.calculate_compatibility(
                user_skills=skills,
                job_title=job_title,
                job_description=job_description,
            )
            return jsonify(result), 200
        except Exception as exc:
            return jsonify({"error": str(exc)}), 502
