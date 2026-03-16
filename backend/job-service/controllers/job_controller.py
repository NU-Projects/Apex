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
