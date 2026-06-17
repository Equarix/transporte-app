import logging
import time
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any

logger = logging.getLogger("ia-module.tracking")
router = APIRouter(prefix="/tracking", tags=["tracking"])

@router.get("/{reserver_id}")
async def get_realtime_tracking(reserver_id: int):
    """
    Simulated live GPS tracking data for a reservation.
    """
    logger.info(f"Generating realtime tracking for reserver_id: {reserver_id}")
    
    origin_lat = -12.046374
    origin_lng = -77.042793
    dest_lat = -8.111867
    dest_lng = -79.028751
    
    now_ts = time.time()
    cycle_seconds = 120
    progress = (now_ts % cycle_seconds) / cycle_seconds
    
    current_lat = origin_lat + (dest_lat - origin_lat) * progress
    current_lng = origin_lng + (dest_lng - origin_lng) * progress
    
    minutes_remaining = int((1 - progress) * 120)
    
    return {
        "reserverId": reserver_id,
        "bus": {
            "plate": "EGF-492",
            "model": "Scania Marcopolo G8",
            "type": "Imperial Class (160°)",
            "capacity": 44
        },
        "driver": {
            "name": "Carlos Gomez",
            "license": "Q-492948"
        },
        "origin": {
            "name": "Terminal Lima (Javier Prado)",
            "lat": origin_lat,
            "lng": origin_lng
        },
        "destination": {
            "name": "Terminal Trujillo (Grau)",
            "lat": dest_lat,
            "lng": dest_lng
        },
        "currentLocation": {
            "lat": current_lat,
            "lng": current_lng,
            "progressPercentage": int(progress * 100)
        },
        "eta": {
            "minutesRemaining": minutes_remaining,
            "status": "A tiempo"
        },
        "services": [
            {"name": "WiFi 5G", "available": True},
            {"name": "USB Charger", "available": True},
            {"name": "Aire Acondicionado", "available": True},
            {"name": "Snack", "available": True}
        ]
    }
