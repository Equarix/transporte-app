import logging
from fastapi import APIRouter, HTTPException, Header, status
from typing import List, Dict, Any, Optional
import os
from services.recommendation_service import RecommendationService

logger = logging.getLogger("ia-module.recommendations")
router = APIRouter(prefix="/recommendations", tags=["recommendations"])

# Internal secret for service-to-service authentication
INTERNAL_SECRET_KEY = os.getenv("INTERNAL_SECRET_KEY", "internal-secret-key")

@router.post("")
async def get_recommendations(
    past_trips: List[Dict[str, Any]],
    limit: Optional[int] = 5,
    x_internal_key: Optional[str] = Header(None)
):
    """
    Generate travel recommendations based on user's past trips.
    Expected to be called internally by the API gateway.
    """
    # Validate internal key
    if x_internal_key != INTERNAL_SECRET_KEY:
        logger.warning("Invalid internal key provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal key"
        )

    logger.info(f"Received request for recommendations with {len(past_trips)} past trips, limit={limit}")

    try:
        service = RecommendationService()
        recommendations = await service.get_recommendations(past_trips, limit)
        return {
            "status": "success",
            "data": recommendations,
            "count": len(recommendations)
        }
    except Exception as e:
        logger.exception("Error generating recommendations")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate recommendations: {str(e)}"
        )