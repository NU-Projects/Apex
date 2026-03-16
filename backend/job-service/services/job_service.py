import json
import os
import re
import requests
from dotenv import load_dotenv
from repositories.job_repository import JobRepository

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'), override=True)


class JobService:
    def __init__(self):
        self.repository = JobRepository()
        self.ollama_api_key = os.getenv("OLLAMA_API_KEY", "").strip()
        self.ollama_model = os.getenv("OLLAMA_MODEL", "").strip()
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "").strip()

    def _resolve_ollama_url(self):
        if self.ollama_base_url:
            return f"{self.ollama_base_url.rstrip('/')}/api/chat"
        if self.ollama_api_key:
            return "https://ollama.com/api/chat"
        return "http://localhost:11434/api/chat"

    def _resolve_openai_compatible_url(self):
        if self.ollama_base_url:
            return f"{self.ollama_base_url.rstrip('/')}/v1/chat/completions"
        if self.ollama_api_key:
            return "https://ollama.com/v1/chat/completions"
        return "http://localhost:11434/v1/chat/completions"

    def _extract_json_array(self, text):
        if not text:
            return []

        stripped = text.strip()
        try:
            parsed = json.loads(stripped)
            if isinstance(parsed, list):
                return [str(item).strip() for item in parsed if str(item).strip()]
        except Exception:
            pass

        match = re.search(r"\[[\s\S]*\]", stripped)
        if not match:
            return []

        try:
            parsed = json.loads(match.group(0))
            if isinstance(parsed, list):
                return [str(item).strip() for item in parsed if str(item).strip()]
        except Exception:
            return []

        return []

    def _call_ollama(self, messages, timeout=90):
        if not self.ollama_model:
            raise ValueError("OLLAMA_MODEL is missing in .env")

        chat_url = self._resolve_ollama_url()
        openai_url = self._resolve_openai_compatible_url()

        headers = {"Content-Type": "application/json"}
        if self.ollama_api_key:
            headers["Authorization"] = f"Bearer {self.ollama_api_key}"

        payload = {
            "model": self.ollama_model,
            "messages": messages,
            "stream": False,
        }

        content = ""
        chat_error = None

        try:
            response = requests.post(chat_url, headers=headers, json=payload, timeout=timeout)
            response.raise_for_status()
            data = response.json()
            content = data.get("message", {}).get("content") or data.get("response") or ""
        except Exception as exc:
            chat_error = exc

        if not content:
            response = requests.post(
                openai_url,
                headers=headers,
                json={"model": self.ollama_model, "messages": messages},
                timeout=timeout,
            )
            response.raise_for_status()
            data = response.json()
            choices = data.get("choices", [])
            if choices:
                content = choices[0].get("message", {}).get("content", "")

        if not content and chat_error:
            raise chat_error

        return content.strip()

    def _normalize_skills(self, skills):
        seen = set()
        normalized = []
        for skill in skills:
            cleaned = str(skill).strip()
            if not cleaned:
                continue
            key = cleaned.lower()
            if key in seen:
                continue
            seen.add(key)
            normalized.append(cleaned)
        return normalized

    def _canonicalize_skill(self, skill):
        text = str(skill).lower().strip()
        text = text.replace("node.js", "node js")
        text = text.replace("ci/cd", "cicd")
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def _tokenize_skill(self, skill):
        tokens = self._canonicalize_skill(skill).split(" ")
        return {token for token in tokens if token}

    def _skills_match(self, user_skill, required_skill):
        user_norm = self._canonicalize_skill(user_skill)
        req_norm = self._canonicalize_skill(required_skill)

        if not user_norm or not req_norm:
            return False

        if user_norm == req_norm:
            return True

        if user_norm in req_norm or req_norm in user_norm:
            return True

        user_tokens = self._tokenize_skill(user_skill)
        req_tokens = self._tokenize_skill(required_skill)
        if not user_tokens or not req_tokens:
            return False

        overlap = len(user_tokens.intersection(req_tokens))
        if overlap == 0:
            return False

        return (overlap / len(req_tokens)) >= 0.5

    def _get_matched_required_skills(self, user_skills, required_skills):
        matched_required = []
        for required_skill in required_skills:
            if any(self._skills_match(user_skill, required_skill) for user_skill in user_skills):
                matched_required.append(required_skill)
        return matched_required

    def _extract_required_skills(self, title, description):
        prompt = (
            "Extract only the technical/professional skills required for this job posting. "
            "Return strictly a JSON array of strings and nothing else.\n\n"
            f"Job title: {title or ''}\n\n"
            f"Job description: {description or ''}"
        )
        content = self._call_ollama(
            messages=[
                {
                    "role": "system",
                    "content": "You extract job requirements and return only JSON arrays.",
                },
                {"role": "user", "content": prompt},
            ],
        )
        skills = self._extract_json_array(content)
        return self._normalize_skills(skills)

    def extract_and_save_missing_job_skills(self, limit=None):
        rows = self.repository.get_jobs_with_null_skills(limit=limit)

        updated = 0
        failed = 0
        skipped = 0
        errors = []

        for job_id, title, description in rows:
            if not title and not description:
                skipped += 1
                continue

            try:
                skills = self._extract_required_skills(title, description)

                success = self.repository.update_job_skills(job_id, skills)
                if success:
                    updated += 1
                else:
                    failed += 1
                    errors.append({"job_id": str(job_id), "error": "Database update failed"})
            except Exception as exc:
                failed += 1
                errors.append({"job_id": str(job_id), "error": str(exc)})

        return {
            "processed": len(rows),
            "updated": updated,
            "failed": failed,
            "skipped": skipped,
            "errors": errors,
        }

    def get_distinct_roles(self):
        return self.repository.get_distinct_roles()

    def get_job_count_by_role(self, role):
        if not role:
            return 0
        return self.repository.get_job_count_by_role(role)

    def get_jobs_by_role(self, role):
        if not role:
            return []
        return self.repository.get_jobs_by_role(role)

    def calculate_compatibility(self, user_skills, job_title, job_description):
        normalized_user_skills = self._normalize_skills(user_skills)
        required_skills = self._extract_required_skills(job_title, job_description)

        if not required_skills:
            return {
                "compatibility_score": 0,
                "gap_analysis": "Could not identify clear required skills from this job post. Please provide a more detailed job description for a reliable compatibility estimate.",
            }

        matched = self._get_matched_required_skills(normalized_user_skills, required_skills)
        missing = [skill for skill in required_skills if skill not in matched]
        score = round((len(matched) / len(required_skills)) * 100)

        have_text = ", ".join([s for i, s in enumerate(matched) if i < 4]) if matched else "no direct core-match skills yet"
        missing_text = ", ".join([s for i, s in enumerate(missing) if i < 4]) if missing else "no major missing skills"

        gap_summary = (
            f"You already have: {have_text}. "
            f"You are currently missing or should strengthen: {missing_text}. "
            "Improving these areas will increase your fit for this role."
        )

        return {
            "compatibility_score": score,
            "gap_analysis": gap_summary,
        }

    def _extract_json_object(self, text):
        """Extract a JSON object from text that may contain markdown fences or extra explanation."""
        if not text:
            return None

        stripped = text.strip()
        try:
            parsed = json.loads(stripped)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            pass

        match = re.search(r"\{[\s\S]*\}", stripped)
        if not match:
            return None

        try:
            parsed = json.loads(match.group(0))
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            return None

        return None

    def get_role_insights(self, current_role, selected_role, skills=None):
        current_count = self.get_job_count_by_role(current_role)
        selected_count = self.get_job_count_by_role(selected_role)

        skills_text = ""
        if skills:
            skills_text = (
                f"\nThe user currently possesses the following skills: {', '.join(skills)}.\n"
                "Consider how transferable these skills are to the selected role, "
                "identify any skill gaps, and factor this into your advice.\n"
            )

        prompt = (
            f"The user is currently a '{current_role}' and considering a change to '{selected_role}'.\n"
            f"There are currently {current_count} jobs available for '{current_role}' and "
            f"{selected_count} jobs available for '{selected_role}' in the job market.\n"
            f"{skills_text}"
            "Based on the roles, the availability of jobs, and the user's current skills, "
            "respond with ONLY a valid JSON object (no extra text) using exactly this structure:\n"
            "{\n"
            '  "selected_role_growth": "<short growth outlook for the selected role>",\n'
            '  "current_role_growth": "<short growth outlook for the current role>",\n'
            '  "decision": true or false (true = should switch, false = should not),\n'
            '  "advice": "<professional career advice under 100 words>"\n'
            "}\n"
        )

        chat_url = self._resolve_ollama_url()
        openai_url = self._resolve_openai_compatible_url()
        headers = {"Content-Type": "application/json"}
        if self.ollama_api_key:
            headers["Authorization"] = f"Bearer {self.ollama_api_key}"

        payload = {
            "model": self.ollama_model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful career advisor AI. You must respond with ONLY valid JSON, no markdown, no explanation.",
                },
                {"role": "user", "content": prompt},
            ],
            "stream": False,
        }

        content = ""
        try:
            response = requests.post(chat_url, headers=headers, json=payload, timeout=90)
            response.raise_for_status()
            data = response.json()
            content = data.get("message", {}).get("content") or data.get("response") or ""
        except Exception:
            pass

        if not content:
            try:
                response = requests.post(
                    openai_url,
                    headers=headers,
                    json={"model": self.ollama_model, "messages": payload["messages"]},
                    timeout=90,
                )
                response.raise_for_status()
                data = response.json()
                choices = data.get("choices", [])
                if choices:
                    content = choices[0].get("message", {}).get("content", "")
            except Exception:
                pass

       
        ai_result = self._extract_json_object(content) if content else None

        if ai_result:
            return {
                "current_role": current_role,
                "selected_role": selected_role,
                "current_role_count": current_count,
                "selected_role_count": selected_count,
                "selected_role_growth": ai_result.get("selected_role_growth", ""),
                "current_role_growth": ai_result.get("current_role_growth", ""),
                "decision": ai_result.get("decision", False),
                "advice": ai_result.get("advice", ""),
            }

    
        return {
            "current_role": current_role,
            "selected_role": selected_role,
            "current_role_count": current_count,
            "selected_role_count": selected_count,
            "selected_role_growth": "",
            "current_role_growth": "",
            "decision": False,
            "advice": content or "Unable to generate advice at this moment.",
        }

    def get_job_counts_by_location(self, country):
        raw_counts = self.repository.get_job_counts_by_location(country)
        if not raw_counts:
            return []

        locations_list = [r["location"] for r in raw_counts if r.get("location")]
        if not locations_list:
            return []

        prompt = (
            f"Normalize the following job location strings into their primary major city in {country}. "
            f"Group sub-areas and variations into their main city name (e.g., 'Johar Town', 'Johar Town, Punjab', 'Lahore, Punjab' all map to 'Lahore'). "
            f"Map 'Karāchi', 'Karachi Division' to 'Karachi'. "
            f"If it's a generic country like '{country}' or 'Remote', map it to '{country}'. "
            f"Return ONLY a strictly valid JSON object mapping every exact raw location string to its normalized city name."
            f"\n\nLocations:\n{json.dumps(locations_list)}"
        )

        try:
            content = self._call_ollama(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a data cleaner. Respond ONLY with a valid JSON object of key-value string pairs.",
                    },
                    {"role": "user", "content": prompt},
                ]
            )
            mapping = self._extract_json_object(content)

            if mapping and isinstance(mapping, dict):
                aggregated = {}
                for row in raw_counts:
                    raw_loc = row.get("location")
                    if not raw_loc:
                        continue
                    
                    count = row.get("count", 0)
                    norm_loc = mapping.get(raw_loc)
                    if not norm_loc or not isinstance(norm_loc, str):
                        norm_loc = raw_loc
                        
                    norm_loc = norm_loc.strip().title()
                    
                    aggregated[norm_loc] = aggregated.get(norm_loc, 0) + count

                return sorted(
                    [{"location": k, "count": v} for k, v in aggregated.items()],
                    key=lambda x: x["count"],
                    reverse=True
                )
        except Exception as exc:
            print(f"Ollama normalization failed: {exc}")

        return raw_counts
