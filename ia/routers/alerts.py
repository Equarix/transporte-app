import logging
from fastapi import APIRouter, Body
from typing import Dict, Any

logger = logging.getLogger("ia-module.alerts")
router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.post("/whatsapp")
async def simulate_whatsapp_alert(payload: Dict[str, Any] = Body(...)):
    """
    Simulates sending a WhatsApp promo alert to the user.
    """
    phone = payload.get("phone", "+51 987654321")
    destination_name = payload.get("destinationName", "Trujillo")
    logger.info(f"WhatsApp alert simulation requested for phone: {phone}, destination: {destination_name}")
    
    message = (
        f"¡Hola viajero! Descubrimos que tienes interés en viajar a {destination_name}. "
        f"Por ser cliente Elite, te regalamos un cupón del 25% de descuento para tu siguiente pasaje. "
        f"Usa el código: RUTAS25 al comprar. Válido por 3 días."
    )
    
    return {
        "success": True,
        "recipient": phone,
        "message": message,
        "channel": "WhatsApp"
    }
