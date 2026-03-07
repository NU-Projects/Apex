import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

class SkillRepository:
    def __init__(self):
        self.conn_str = os.getenv("DATABASE_URL")

    def get_db_connection(self):
        return psycopg2.connect(self.conn_str)

    def update_user_skills(self, email, skills):
        conn = self.get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                "UPDATE users SET skills = %s WHERE email = %s",
                (skills, email)
            )
            conn.commit()
            return True
        except Exception as e:
            print(f"Database error: {e}")
            conn.rollback()
            return False
        finally:
            cur.close()
            conn.close()
