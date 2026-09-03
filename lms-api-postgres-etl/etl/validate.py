import logging
from pydantic import BaseModel, ValidationError
from schemas import Submission


logger = logging.getLogger(__name__)

def validate_record(row: dict) -> dict | None:
  try:
    item = Submission(**row)
    return item.model_dump()
  except ValidationError as err:
    logger.warning(f"Запись отброшена (user_id={row.get('user_id')}): {err.error_count()} ошибок валидации")
    return None


def validate_records(rows: list[dict]) -> list[dict]:
  valid = []
  skipped = 0

  for row in rows:
    item = validate_record(row)

    if item is None:
      skipped += 1
      continue 

    valid.append(item)

  logger.info(f"Валидно: {len(valid)}, отброшено: {skipped}")
  return valid