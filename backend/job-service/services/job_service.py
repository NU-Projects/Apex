import json
import os
import re
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'), override=True)


class JobService:
    def __init__(self):
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
        # Normalize common separators and variants to improve matching quality.
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

        # Count as a match when a meaningful portion of the required phrase overlaps.
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

    def _build_gap_summary(self, job_title, job_description, user_skills, missing_skills, score):
        prompt = (
            "Write one short paragraph (max 70 words) explaining candidate skill gaps. "
            "Do not include bullets or numbering.\n\n"
            f"Job title: {job_title}\n\n"
            f"Job description: {job_description}\n\n"
            f"Candidate skills: {json.dumps(user_skills)}\n"
            f"Missing skills: {json.dumps(missing_skills)}\n"
            f"Compatibility score: {score}%"
        )

        content = self._call_ollama(
            messages=[
                {
                    "role": "system",
                    "content": "You produce concise hiring feedback paragraphs.",
                },
                {"role": "user", "content": prompt},
            ],
        )

        return re.sub(r"\s+", " ", content).strip()

    def calculate_compatibility(self, user_skills, job_title, job_description):
        normalized_user_skills = self._normalize_skills(user_skills)
        required_skills = self._extract_required_skills(job_title, job_description)

        if not required_skills:
            score = 0
            missing_skills = []
        else:
            matched_required = self._get_matched_required_skills(
                user_skills=normalized_user_skills,
                required_skills=required_skills,
            )
            score = round((len(matched_required) / len(required_skills)) * 100)
            matched_set = set(matched_required)
            missing_skills = [skill for skill in required_skills if skill not in matched_set]

        gap_summary = self._build_gap_summary(
            job_title=job_title,
            job_description=job_description,
            user_skills=normalized_user_skills,
            missing_skills=missing_skills,
            score=score,
        )

        return {
            "compatibility_score": score,
            "gap_analysis": gap_summary,
        }
