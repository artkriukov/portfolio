import os
import smtplib
import logging
from typing import Optional
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

load_dotenv()
email_from = os.getenv("SMTP_USER")
email_to = os.getenv("NOTIFICATION_EMAIL")
password = os.getenv("SMTP_PASSWORD")

def send_message(
  total_records: int,         
  written_records: int, 
  date: str,
  error_code: Optional[int] = None
):
  try:
    msg = create_msg(total_records, written_records, date, error_code)
    server = smtplib.SMTP_SSL("smtp.yandex.ru", 465)
    server.login(email_from, password)
    server.send_message(msg)
    server.quit()
    logger.info(f"Уведомление отправлено на {email_to}")
  except Exception as err:
    logger.error(f"Не удалось отправить уведомление: {err}", exc_info=True)


def create_msg(
  total_records: int,         
  written_records: int, 
  date: str,
  error_code: Optional[int] = None
) -> MIMEMultipart:
  msg = MIMEMultipart()
  msg["From"] = email_from
  msg["To"] = email_to
  msg["Subject"] = "Отчет обновления базы данных"

  text_body = f"""
  Здравствуйте!

  Это автоматическое уведомление о работе пайплайна.

  Период обработки: {date}
  Статус выполнения: {'Успешно' if error_code is None else 'Ошибка'}
  Всего обработано записей: {total_records}
  Успешно записано: {written_records}
  Пропущено записей: {total_records - written_records}
  """
  if error_code is not None:
    text_body += f"""
  Код ошибки: {error_code}
  """
  text_body += f"""
  Отчет за: {date}
  ---
  С уважением,
  Система мониторинга
  """
  msg.attach(MIMEText(text_body, "plain", "utf-8"))
  return msg
