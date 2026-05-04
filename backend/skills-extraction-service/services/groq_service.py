import os
import requests
import re

class GroqService:
    def __init__(self):
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"
        self.api_key = os.getenv("GROQ_API")

    def get_missing_skills(self, role, current_skills):
        skills_str = ", ".join(current_skills) if current_skills else "None"
        
        prompt = (
            f"Role: {role}\n"
            f"Already Known Skills (Candidate's profile): {skills_str}\n\n"
            "Task: Identify the TOP 10 specialized technical skills this candidate is MISSING to be fully qualified for this role.\n"
            "Rules:\n"
            "1. NO REDUNDANCY: If the candidate knows a framework (e.g. Pandas, NumPy), assume they know the language (Python). If we are fetching from GitHub/LinkedIn, they ALREADY know 'Git', 'GitHub', 'Version Control'. DO NOT include these.\n"
            "2. INTELLIGENCE: Do not list skills they already have or close synonyms (e.g. if 'NLP' is known, don't list 'Natural Language Processing').\n"
            "3. CLEAN FORMAT: Provide ONLY the names of the missing skills. No suffixes like 'programming', 'skills', or 'experience'. No parentheses like '(Git)'.\n"
            "4. OUTPUT: Provide only a single comma-separated list. No introduction, no numbered lists, no explanation.\n"
        )
        
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }

            response = requests.post(self.groq_url, headers=headers, json={
                "model": self.model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a skills gap analyzer. Return ONLY a comma-separated list of missing skills."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.3,
                "max_tokens": 500
            }, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                text = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                
                # Remove common prefixes/garbage if LLM ignores instructions
                if text.lower().startswith("missing skills:"):
                    text = text[14:].strip()
                
                # Split by comma or newline and clean
                skills = []
                # Handle both comma separated and newline separated just in case
                raw_items = []
                if "," in text:
                    raw_items = text.split(",")
                else:
                    raw_items = text.split("\n")

                for s in raw_items:
                    clean = s.strip().strip("-").strip("*").strip()
                    # Final formatting cleanup: Remove parentheses and everything inside them
                    clean = re.sub(r'\(.*?\)', '', clean).strip()
                    # Remove "programming" or "skills" suffix if LLM failed rules
                    clean = re.sub(r'(?i)\s+programming|\s+skills?', '', clean).strip()
                    
                    # Deduplicate with current skills (client-side check as backup)
                    low_current = [c.lower() for c in current_skills]
                    if clean and clean.lower() not in low_current:
                        skills.append(clean)
                
                return list(set(skills))[:10]  # Ensure uniqueness and limit to 10
            return []
        except Exception as e:
            print(f"Error calling Groq: {e}")
            return []
