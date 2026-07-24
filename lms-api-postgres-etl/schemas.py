from datetime import datetime
from pydantic import BaseModel

class Submission(BaseModel):
  lti_user_id: str
  oauth_consumer_key: str | None 
  lis_result_sourcedid: str
  lis_outcome_service_url: str
  is_correct: bool | None
  attempt_type: str
  created_at: datetime

def validate_record():