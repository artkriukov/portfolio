import logging
from datetime import datetime, timedelta, timezone
from logging_setup import setup_logging
from extract import fetch_submissions_by_chunks
from transform import transform_records
from validate import validate_records
from load import load_submissions
from notifications import send_message
from db_utils import get_last_date_from_db

logger = logging.getLogger(__name__)

def main():
  setup_logging()

  end = datetime.now(timezone.utc)
  start = get_last_date_from_db()
  period_str = f"{start.strftime('%d.%m.%Y %H:%M')} — {end.strftime('%d.%m.%Y %H:%M')}"

  logger.info(f"Старт пайплайна за период {period_str}")

  total_records = 0
  written_records = 0

  try:

    for raw in fetch_submissions_by_chunks(start, end, 1):
      valid = validate_records(transform_records(raw))
      total_records += len(valid)

      chunk_written = load_submissions(valid)
      written_records += chunk_written
    
    logger.info(f"Пайплайн завершён успешно. Обработано: {total_records}, записано: {written_records}")
    send_message(
      total_records=total_records,     
      written_records=written_records, 
      date=period_str
    )

  except Exception as err:
    error_text = f"{type(err).__name__}"
    logger.error(f"Пайплайн упал: {error_text}", exc_info=True)
    send_message(
      total_records=total_records,     
      written_records=written_records, 
      date=period_str,
      error_code=error_text
    )



if __name__ == "__main__":
  main()