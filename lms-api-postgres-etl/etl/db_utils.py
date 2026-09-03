import os
from datetime import datetime, timedelta
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)
load_dotenv()

def get_last_date_from_db():
  uri = os.getenv("DB_URL")

  query = sql.SQL("""
    SELECT MAX(created_at) 
    FROM submissions
    """)

  if not uri:
    logger.error("DB_URL не задан в .env")
    raise

  try:
    conn = psycopg2.connect(uri, sslmode="require")
    with conn:
      with conn.cursor() as cursor:
        cursor.execute(query)
        result = cursor.fetchone()

        if result and result[0] is not None:
          last_date = result[0]
          if isinstance(last_date, datetime):
            return last_date
          else:
            return datetime.combine(last_date, datetime.min.time(), tzinfo=timezone.utc)
        else:
          yesterday = datetime.now(timezone.utc).date() - timedelta(days=1)
          return datetime.combine(yesterday, datetime.min.time(), tzinfo=timezone.utc)


  except Exception as err:
    logger.error(f"Не удалось подключиться к БД: {err}", exc_info=True)
    return datetime.now().date() - timedelta(days=1)
  finally:
    conn.close()