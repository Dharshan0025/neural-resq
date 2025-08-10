from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import (
    auth, 
    distress, 
    sos, 
    location, 
    notification, 
    history, 
    volunteer, 
    payment, 
    admin
)
from app.core.database import engine, Base
from app.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Include all API routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(distress.router, prefix=settings.API_V1_STR)
app.include_router(sos.router, prefix=settings.API_V1_STR)
app.include_router(location.router, prefix=settings.API_V1_STR)
app.include_router(notification.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)
app.include_router(volunteer.router, prefix=settings.API_V1_STR)
app.include_router(payment.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Emergency Response System API"}