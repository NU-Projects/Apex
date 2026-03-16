from flask import jsonify
from services.job_service import JobService


class JobController:
    def __init__(self):
        self.job_service = JobService()

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
