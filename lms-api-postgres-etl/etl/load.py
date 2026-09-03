import os
import logging

import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import execute_values

load_dotenv()

uri = os.getenv("DB_URL")
logger = logging.getLogger(__name__)

BATCH_SIZE = 5000

INSERT_SQL = """
INSERT INTO submissions (
  user_id,
  oauth_consumer_key,
  lis_result_sourcedid,
  lis_outcome_service_url,
  is_correct,
  attempt_type,
  created_at
) VALUES %s
ON CONFLICT (user_id, attempt_type, created_at) DO NOTHING
"""


def _insert_submission(cursor, rows: list[dict]) -> int:
  values = [
    (
      row["user_id"],
      row["oauth_consumer_key"],
      row["lis_result_sourcedid"],
      row["lis_outcome_service_url"],
      row["is_correct"],
      row["attempt_type"],
      row["created_at"],
    )
      for row in rows
    ]

  if not values:
    return 0

  execute_values(cursor, INSERT_SQL, values, page_size=len(values))
  return cursor.rowcount


def load_submissions(
  rows: list[dict],
  period_start=None,
  period_end=None,
)->int:

  if not rows:
    logger.debug("Пустой чанк, пропуск записи в БД")
    return 0

  if not uri:
    logger.error("DB_URL не задан в .env")
    raise 

  if period_start and period_end:
    logger.info(
      f"Запись в БД началась: {period_start} — {period_end}, "
      f"записей: {len(rows)}"
    )
  else:
    logger.info(f"Запись в БД: {len(rows)} записей")

  conn = psycopg2.connect(uri, sslmode="require")

  try:
    with conn:
      with conn.cursor() as cursor:
        inserted = 0
        total = len(rows)

        for start in range(0, total, BATCH_SIZE):
          batch = rows[start:start + BATCH_SIZE]
          inserted += _insert_submission(cursor, batch)

          done = min(start + BATCH_SIZE, total)
          logger.debug(f"БД: вставлен батч {done}/{total}")

          skipped = total - inserted

        if period_start and period_end:
          logger.info(f"Запись в БД завершена: {period_start} — {period_end}.")

        return inserted

  except psycopg2.Error:
    logger.exception("Ошибка загрузки в PostgreSQL")
    raise
  finally:
    conn.close()