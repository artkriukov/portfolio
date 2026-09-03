import logging
import os

from datetime import datetime, timedelta, timezone
from requests import get
from dotenv import load_dotenv
from requests.exceptions import ConnectionError, HTTPError, Timeout

load_dotenv()
logger = logging.getLogger(__name__)

API_URL = os.getenv("API_URL")
API_CLIENT = os.getenv("API_CLIENT")
API_CLIENT_KEY = os.getenv("API_CLIENT_KEY")

# формат API: 2023-04-01 12:46:47.860798
DATE_FMT = "%Y-%m-%d %H:%M:%S.%f"


def fetch_submissions(start_date, end_date):

  start_str = start_date.strftime(DATE_FMT)
  end_str = end_date.strftime(DATE_FMT)

  params = {
    "client": API_CLIENT,
    "client_key": API_CLIENT_KEY,
    "start": start_str,
    "end": end_str,
  }

  try:
    logger.info(f"Запрос данных с {start_str} по {end_str}")
    response = get(API_URL, params=params, timeout=50)
    response.raise_for_status()
    data = response.json()
  except HTTPError as err:
    status = err.response.status_code if err.response is not None else "?"
    logger.warning(f"HTTP ошибка, статус код {status}")
    raise
  except ConnectionError:
    logger.warning("Не удалось установить соединение с сервером")
    raise
  except Timeout:
    logger.warning("Истекло время ожидания")
    raise

  if not data:
    logger.info(f"Данных за период с {start_str} по {end_str} нет")
    return []

  logger.info(f"Получено {len(data)} записей")
  return data


def fetch_submissions_by_chunks(start_date, end_date, chunk_days=7):
  if end_date <= start_date:
    logger.warning("Дата конца должна быть позже даты начала")
    raise 

  if chunk_days <= 0:
    logger.warning("chunk_days должен быть больше 0")
    raise 

  current_start = start_date

  while current_start < end_date:
    current_end = min(current_start + timedelta(days=chunk_days), end_date)

    chunk = fetch_submissions(current_start, current_end)

    if chunk:       
      yield chunk
  
    current_start = current_end