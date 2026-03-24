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

    def get_jobs_by_role(self, role):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT id, title, platform, url, description
                FROM jobs
                WHERE role ILIKE %s
                ORDER BY created_at DESC
                """,
                (f"%{role}%",),
            )
            rows = cur.fetchall()
            cur.close()
            return [
                {
                    "id": str(row[0]),
                    "title": row[1] or "",
                    "platform": (row[2] or "").lower(),
                    "apply_url": row[3] or "",
                    "description": row[4] or "",
                }
                for row in rows
            ]
        except Exception as exc:
            print(f"Failed to get jobs for role {role}: {exc}")
            return []
        finally:
            if conn:
                conn.close()

    def get_job_counts_by_location(self, country):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            query = """
                SELECT COALESCE(normalized_location, location) as loc, COUNT(*) 
                FROM jobs 
                WHERE country ILIKE %s 
                GROUP BY 1 
                ORDER BY 2 DESC
            """
            cur.execute(query, (f"%{country}%",))
            rows = cur.fetchall()
            cur.close()
            return [{"location": r[0], "count": r[1]} for r in rows if r[0]]
        except Exception as exc:
            print(f"Failed to get location counts for {country}: {exc}")
            return []
        finally:
            if conn:
                conn.close()

    def get_unique_raw_locations(self, country):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            cur.execute(
                """
                SELECT DISTINCT location FROM jobs
                WHERE country ILIKE %s AND location IS NOT NULL AND normalized_location IS NULL
                """,
                (f"%{country}%",)
            )
            rows = cur.fetchall()
            cur.close()
            return [str(row[0]).strip() for row in rows if row[0]]
        except Exception as exc:
            print(f"Failed to get raw locations for {country}: {exc}")
            return []
        finally:
            if conn:
                conn.close()

    def update_normalized_locations(self, country, mapping):
        if not mapping:
            return True
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            for raw_loc, norm_loc in mapping.items():
                cur.execute(
                    """
                    UPDATE jobs SET normalized_location = %s
                    WHERE country ILIKE %s AND location = %s
                    """,
                    (norm_loc, f"%{country}%", raw_loc)
                )
            conn.commit()
            cur.close()
            return True
        except Exception as exc:
            print(f"Failed to update normalized locations: {exc}")
            if conn:
                conn.rollback()
            return False
        finally:
            if conn:
                conn.close()

    def get_unnormalized_geographies(self):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            # Fetch unique pairs of country/location that need normalization
            cur.execute(
                """
                SELECT DISTINCT country, location 
                FROM jobs 
                WHERE normalized_location IS NULL 
                   OR country NOT IN ('Pakistan', 'United States')
                """
            )
            rows = cur.fetchall()
            cur.close()
            return [{"raw_country": r[0], "raw_location": r[1]} for r in rows]
        except Exception as exc:
            print(f"Failed to fetch unnormalized geographies: {exc}")
            return []
        finally:
            if conn:
                conn.close()

    def update_job_geography(self, raw_country, raw_location, norm_country, norm_city):
        conn = None
        try:
            conn = self.get_db_connection()
            cur = conn.cursor()
            cur.execute(
                """
                UPDATE jobs 
                SET country = %s, normalized_location = %s
                WHERE (country = %s OR (country IS NULL AND %s IS NULL))
                  AND (location = %s OR (location IS NULL AND %s IS NULL))
                """,
                (norm_country, norm_city, raw_country, raw_country, raw_location, raw_location)
            )
            conn.commit()
            cur.close()
            return True
        except Exception as exc:
            print(f"Failed to update geography for {raw_location} in {raw_country}: {exc}")
            if conn:
                conn.rollback()
            return False
        finally:
            if conn:
                conn.close()
