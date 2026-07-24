import ast
import logging

logger = logging.getLogger(__name__)

def parse_passback_params(raw: str | None) -> dict:
  if not raw:
    logger.info('Данных за период нет, вернули пустой {}')
    return {}
  
  try:
    parsed = ast.literal_eval(raw)
    
    if isinstance(parsed, dict):
      return parsed
    
    logger.warning("passback_params не dict: %s", type(parsed).__name__)
    return {}

  except (ValueError, SyntaxError) as err:
        logger.warning("Не разобрали passback_params: %s", err)
        return {} 


def transform_record(row: dict) -> dict:
  parsed = parse_passback_params(row.get('passback_params'))

  return {
    'lti_user_id': row.get("lti_user_id"),
    'oauth_consumer_key': parsed.get("oauth_consumer_key") or None,
    'lis_result_sourcedid': parsed.get("lis_result_sourcedid"),
    'lis_outcome_service_url': parsed.get("lis_outcome_service_url"),
    'is_correct': row.get("is_correct"),
    'attempt_type': row.get("attempt_type"),
    'created_at': row.get("created_at")
  }
  

def transform_records(data: list[dict]) -> list[dict]:
    result = []

    for row in data:
        result.append(transform_record(row))

    logger.info("Трансформировано записей: %s", len(result))
    return result