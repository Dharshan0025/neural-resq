from pydantic import BaseModel
from typing import List, Dict, Any

class DistressDetectionResult(BaseModel):
    is_distress: bool
    confidence: float
    details: List[Dict[str, Any]]