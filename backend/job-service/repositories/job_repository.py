import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))


class JobRepository:
    def __init__(self):
        self.conn_str = os.getenv("DATABASE_URL")

    def get_db_connection(self):
        if not self.conn_str:
            raise ValueError("DATABASE_URL is missing in .env")
        return psycopg2.connect(self.conn_str)

    def get_jobs_with_null_skills(self, limit=None):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()

            if limit is not None:
                cur.execute(
                    """
                    SELECT id, title, description
                    FROM jobs
                    WHERE skills IS NULL
                    ORDER BY created_at DESC
                    LIMIT %s
                    """,
                    (limit,),
                )
            else:
                cur.execute(
                    """
                    SELECT id, title, description
                    FROM jobs
                    WHERE skills IS NULL
                    ORDER BY created_at DESC
                    """
                )

            rows = cur.fetchall()
            cur.close()
            return rows
        finally:
            if conn:
                conn.close()

    def update_job_skills(self, job_id, skills):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            cur.execute("UPDATE jobs SET skills = %s WHERE id = %s", (skills, str(job_id)))
            conn.commit()
            cur.close()
            return True
        except Exception as exc:
            if conn:
                conn.rollback()
            print(f"Failed to update job {job_id}: {exc}")
            return False
        finally:
            if conn:
                conn.close()
