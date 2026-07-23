import logging
import os
from datetime import date, timedelta

def setup_logging():
  today = date.today().isoformat()
  
  os.makedirs("logs", exist_ok=True)
  log_path = os.path.join("logs", f"{today}.log")

  remove_old_logs()

  logging.basicConfig(
    level=logging.INFO, 
    filename=log_path,
    format="%(asctime)s %(module)s %(levelname)s %(funcName)s %(message)s"
  )

def remove_old_logs(days=3):
    logs_dir = "logs"

    if not os.path.isdir(logs_dir):
        return

    threshold = date.today() - timedelta(days=days)

    for name in os.listdir(logs_dir):
        if not name.endswith(".log"):
            continue
       
        try:
            file_date = date.fromisoformat(name.removesuffix(".log"))
        except ValueError:
            continue  
        if file_date < threshold:
            os.remove(os.path.join(logs_dir, name))