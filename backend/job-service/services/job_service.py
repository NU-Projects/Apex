import json
import os
import re
import requests
from dotenv import load_dotenv
from repositories.job_repository import JobRepository

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))


class JobService:
    def __init__(self):
        self.repository = JobRepository()
        self.ollama_api_key = os.getenv("OLLAMA_API_KEY", "").strip()
        self.ollama_model = os.getenv("OLLAMA_MODEL", "").strip()
        # If OLLAMA_BASE_URL is not provided, prefer cloud when key exists, else local Ollama.
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

        # Fallback if model surrounds JSON with explanation or code fences.
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

    def _extract_skills_from_ollama(self, title, description):
        if not self.ollama_model:
            raise ValueError("OLLAMA_MODEL is missing in .env")

        chat_url = self._resolve_ollama_url()
        openai_url = self._resolve_openai_compatible_url()

        prompt = (
            "Extract only the technical/professional skills required for this job. "
            "Return strictly a JSON array of strings and nothing else.\n\n"
            f"Job title: {title or ''}\n\n"
            f"Job description: {description or ''}"
        )

        headers = {"Content-Type": "application/json"}
        if self.ollama_api_key:
            headers["Authorization"] = f"Bearer {self.ollama_api_key}"

        payload = {
            "model": self.ollama_model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a job skill extraction engine. Output only a JSON array.",
                },
                {"role": "user", "content": prompt},
            ],
            "stream": False,
        }

        content = ""
        chat_error = None

        try:
            response = requests.post(chat_url, headers=headers, json=payload, timeout=90)
            response.raise_for_status()
            data = response.json()
            content = data.get("message", {}).get("content") or data.get("response") or ""
        except Exception as exc:
            chat_error = exc

        if not content:
            # Fallback for OpenAI-compatible deployments.
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

        if not content and chat_error:
            raise chat_error

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
                skills = self._extract_skills_from_ollama(title, description)

                # Save empty array when no skills are found so row is not repeatedly retried.
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
