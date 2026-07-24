import os
import psycopg2
import logging
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('DB_URL')
logger = logging.getLogger(__name__)

def load_submissions(rows: list[dict]):
  if not rows:
    logger.info("Нечего загружать в БД")
    return

  if not uri:
    raise ValueError("DB_URL не задан в .env")

  # Supabase требует SSL; без sslmode соединение часто рвётся
  conn = psycopg2.connect(uri, sslmode="require")
  
  try:
    with conn:
      with conn.cursor() as cursor:
        logger.info("Запись в БД началась...")
        for row in rows:
          cursor.execute(
            """
            INSERT INTO submissions (
                lti_user_id,
                oauth_consumer_key,
                lis_result_sourcedid,
                lis_outcome_service_url,
                is_correct,
                attempt_type,
                created_at
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                row["lti_user_id"],
                row["oauth_consumer_key"],
                row["lis_result_sourcedid"],
                row["lis_outcome_service_url"],
                row["is_correct"],
                row["attempt_type"],
                row["created_at"]
            )
          )
        
    logger.info("В БД загружено записей: %s", len(rows))

  except psycopg2.Error:
    logger.exception("Ошибка загрузки в PostgreSQL")
    raise
  finally:
    conn.close()



  