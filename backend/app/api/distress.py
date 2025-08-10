from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import tempfile
import os

from app.core.ai_models import ai_models
from app.core.security import get_current_user
from app.schemas.distress import DistressDetectionResult
from app.models.emergency import Emergency
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/distress/predict", response_model=DistressDetectionResult)
async def predict_distress(
    audio_file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            temp_audio.write(await audio_file.read())
            temp_path = temp_audio.name
        
        # Process the audio file
        result = await ai_models.detect_distress(temp_path)
        
        # Clean up the temp file
        os.unlink(temp_path)
        
        # Determine if distress was detected
        is_distress = any(p['label'] == 'distress' and p['score'] > 0.7 for p in result)
        
        # Log this detection in the database
        emergency = Emergency(
            user_id=current_user.id,
            detection_type="audio",
            detection_data={"result": result},
            is_confirmed=is_distress
        )
        await emergency.save(db)
        
        return {
            "is_distress": is_distress,
            "confidence": max(p['score'] for p in result),
            "details": result
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing audio: {str(e)}"
        )