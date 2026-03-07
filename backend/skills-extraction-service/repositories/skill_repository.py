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
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            cur.execute("UPDATE users SET skills = %s WHERE email = %s", (skills, email))
            conn.commit()
            cur.close()
            return True
        except Exception as e:
            print(f"Database error: {e}")
            if conn: conn.rollback()
            return False
        finally:
            if conn: conn.close()
