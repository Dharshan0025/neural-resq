from pydantic import BaseModel
from typing import Dict

class EmergencyStats(BaseModel):
    total: int
    confirmed: int
    by_type: Dict[str, int]

class UserStats(BaseModel):
    total: int
    active: int

class AdminAnalytics(BaseModel):
    total_emergencies: int
    confirmed_emergencies: int
    emergencies_by_type: Dict[str, int]
    total_users: int
    active_users: int
    time_period_days: int