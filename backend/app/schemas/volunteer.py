from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class VolunteerCreate(BaseModel):
    is_active: bool = True
    qualifications: List[str] = []
    availability: Dict[str, List[str]] = {}

class VolunteerResponse(BaseModel):
    success: bool
    volunteer_id: str

class NearbyVolunteer(BaseModel):
    user_id: str
    distance_km: float
    qualifications: List[str]
    last_updated: datetime

class NearbyVolunteers(BaseModel):
    count: int
    volunteers: List[NearbyVolunteer]
    center_lat: float
    center_lng: float
    radius_km: float