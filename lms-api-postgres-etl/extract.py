import logging
import os
import json

from datetime import datetime, timedelta, timezone
from requests import get
from requests.exceptions import ConnectionError, HTTPError, Timeout
from dotenv import load_dotenv


load_dotenv()
logger = logging.getLogger(__name__)

API_URL = os.getenv("API_URL")
API_CLIENT = os.getenv("API_CLIENT")
API_CLIENT_KEY = os.getenv("API_CLIENT_KEY")

def fetch_submissions():
  end = datetime.now(timezone.utc)
  start = end - timedelta(days=1)
    # формат: 2023-04-01 12:46:47.860798
  fmt = "%Y-%m-%d %H:%M:%S.%f"
  start_str = start.strftime(fmt)
  end_str = end.strftime(fmt)

  params = {
    "client": API_CLIENT,
    "client_key": API_CLIENT_KEY,
    "start": start_str,
    "end": end_str,
  }

  try:
    logger.info(f'Запрос данных с сервера в период с {start_str} по {end_str}')
    response = get(API_URL, params=params, timeout=50)
    response.raise_for_status()
    data = response.json()
  except HTTPError as err:
    status = err.response.status_code if err.response is not None else "?"
    logger.warning("HTTP ошибка, статус код %s", status)
    raise
  except ConnectionError:
    logger.warning('Не удалось установить соединение с сервером')
    raise
  except Timeout:
    logger.warning('Истекло время ожидания')
    raise
  else:

    if not data:
      logger.info(f'Данных за период с {start_str} по {end_str} нет')
      return []

    logger.info("Получено %s записей", len(data))

    write_data(data, start_str)

    return data

def write_data(data, start_str):
    raw_dir = "data/raw"
    os.makedirs(raw_dir, exist_ok=True)
    file_path = os.path.join(raw_dir, f"submissions_{start_str[:10]}.json")
    with open(file_path, "w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)
    logger.info("Сырые данные сохранены в %s", file_path)