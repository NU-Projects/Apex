from flask import jsonify
from services.job_service import JobService
from services.sync_service import SyncService


class JobController:
    def __init__(self):
        self.job_service = JobService()
        self.sync_service = SyncService()

    def get_distinct_roles(self):
        roles = self.job_service.get_distinct_roles()
        return jsonify({"roles": roles}), 200

    def get_job_count(self, role):
        if not role:
            return jsonify({"error": "role parameter is required"}), 400
        count = self.job_service.get_job_count_by_role(role)
        return jsonify({"role": role, "count": count}), 200

    def get_jobs_by_role(self, role):
        if not role:
            return jsonify({"error": "role is required"}), 400
        jobs = self.job_service.get_jobs_by_role(role)
        return jsonify({"jobs": jobs, "count": len(jobs)}), 200

    def sync_jobs(self):
        try:
            result = self.sync_service.check_and_sync()
            return jsonify(result), 200
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500

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

    def get_location_counts(self, country):
        if not country:
            return jsonify({"error": "country parameter is required"}), 400
        counts = self.job_service.get_job_counts_by_location(country)
        return jsonify(counts), 200

    def normalize_locations(self, data):
        import requests
        country = data.get("country")
        locations = data.get("locations", None)
        if not country:
            return jsonify({"error": "country string is required"}), 400
        
        try:
            mapping = self.job_service.normalize_locations(country, locations)
            return jsonify(mapping), 200
        except requests.exceptions.ConnectionError:
            return jsonify({
                "error": "Groq API connection error. Please check your internet connection and API key."
            }), 503
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def normalize_all_jobs(self):
        try:
            result = self.job_service.normalize_all_geographies()
            return jsonify(result), 200
        except Exception as exc:
            return jsonify({"error": str(exc)}), 500
