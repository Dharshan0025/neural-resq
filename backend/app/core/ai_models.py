from transformers import pipeline
from app.config import settings
import torch

class AIModels:
    def __init__(self):
        self.distress_model = None
        self.emotion_model = None
        
    async def load_models(self):
        # Load distress detection model
        self.distress_model = pipeline(
            "audio-classification", 
            model=settings.HF_MODEL_NAME,
            token=settings.HF_API_TOKEN
        )
        
        # Load emotion detection model
        self.emotion_model = pipeline(
            "text-classification",
            model="finiteautomata/bertweet-base-emotion-analysis",
            token=settings.HF_API_TOKEN
        )
    
    async def detect_distress(self, audio_file):
        if not self.distress_model:
            await self.load_models()
        
        result = self.distress_model(audio_file)
        return result
    
    async def detect_emotion(self, text):
        if not self.emotion_model:
            await self.load_models()
        
        result = self.emotion_model(text)
        return result

ai_models = AIModels()