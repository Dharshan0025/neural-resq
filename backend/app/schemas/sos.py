from pydantic import BaseModel
from typing import Optional

class SOSCreate(BaseModel):
    location_lat: str
    location_lng: str
    additional_info: Optional[str] = None

class SOSResponse(BaseModel):
    success: bool
    emergency_id: str
    notifications_sent: int