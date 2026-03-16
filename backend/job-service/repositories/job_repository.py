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

    def get_job_count_by_role(self, role):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            query = "SELECT COUNT(*) FROM jobs WHERE title ILIKE %s OR description ILIKE %s"
            cur.execute(query, (f"%{role}%", f"%{role}%"))
            count = cur.fetchone()[0]
            cur.close()
            return count
        except Exception as exc:
            print(f"Failed to get count for role {role}: {exc}")
            return 0
        finally:
            if conn:
                conn.close()

    def get_distinct_roles(self):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            cur.execute("SELECT DISTINCT role FROM jobs WHERE role IS NOT NULL ORDER BY role")
            rows = cur.fetchall()
            cur.close()
            return [row[0] for row in rows]
        except Exception as exc:
            print(f"Failed to get distinct roles: {exc}")
            return []
        finally:
            if conn:
                conn.close()

    def get_latest_job_created_at(self):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            cur.execute("SELECT created_at FROM jobs ORDER BY created_at DESC LIMIT 1")
            row = cur.fetchone()
            cur.close()
            if row:
                return row[0]
            return None
        except Exception as exc:
            print(f"Failed to get latest job created_at: {exc}")
            return None
        finally:
            if conn:
                conn.close()
