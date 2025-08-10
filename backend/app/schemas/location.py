from pydantic import BaseModel
from datetime import datetime

class LocationUpdate(BaseModel):
    latitude: str
    longitude: str
    accuracy: str
    timestamp: datetime

class LocationResponse(BaseModel):
    success: bool
    latitude: str
    longitude: str
    timestamp: datetime