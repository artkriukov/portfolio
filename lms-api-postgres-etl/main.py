import logging
from logging_setup import setup_logging
from extract import fetch_submissions
from transform import transform_records
from validate import validate_records

logger = logging.getLogger(__name__)

def main():
  setup_logging()
  logger.info('Старт пайплайна')

  raw = fetch_submissions()
  clean = transform_records(raw)
  valid = validate_records(clean) 

  logger.info('Конец пайплайна')

if __name__ == "__main__":
  main()