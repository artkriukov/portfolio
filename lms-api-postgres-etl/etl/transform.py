import ast
import logging

logger = logging.getLogger(__name__)

def parse_passback_params(raw: str | None) -> dict:
  if not raw:
    return {}
  
  try:
    parsed = ast.literal_eval(raw)
    
    if isinstance(parsed, dict):
      return parsed

    return {}

  except (ValueError, SyntaxError) as err:
        logger.warning(f"Не разобрали passback_params: {err}")
        return {} 


def transform_record(row: dict) -> dict:
  parsed = parse_passback_params(row.get('passback_params'))

  return {
    'user_id': row.get("lti_user_id"),
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

    return result