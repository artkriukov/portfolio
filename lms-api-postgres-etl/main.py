import logging
from logging_setup import setup_logging
from extract import fetch_submissions

logger = logging.getLogger(__name__)

def main():
  setup_logging()
  logger.info('Старт пайплайна')

  try:
    data = fetch_submissions()
    if not data: return
  except Exception:
    logger.exception("Пайплайн завершился с ошибкой")
    return  

  logger.info('Конец пайплайна')

if __name__ == "__main__":
  main()