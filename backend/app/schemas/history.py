from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any

class EmergencyHistory(BaseModel):
    id: str
    detection_type: str
    is_confirmed: bool
    created_at: datetime
    location_lat: Optional[str]
    location_lng: Optional[str]

    class Config:
        orm_mode = True

class AnalyticsResponse(BaseModel):
    total_emergencies: int
    confirmed_emergencies: int
    by_type: Dict[str, int]
    time_period_days: int