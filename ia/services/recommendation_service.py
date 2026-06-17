import logging
from typing import List, Dict, Any
from services.api_client import ApiClient

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self):
        self.api_client = ApiClient()
        # Cache destinations to avoid repeated calls
        self._destinations_cache: List[Dict[str, Any]] = []

    async def get_all_destinations(self) -> List[Dict[str, Any]]:
        """Fetch all destinations from the public API."""
        if not self._destinations_cache:
            try:
                self._destinations_cache = self.api_client.get_destinations()
                logger.info(f"Fetched {len(self._destinations_cache)} destinations")
            except Exception as e:
                logger.error(f"Failed to fetch destinations: {e}")
                self._destinations_cache = []
        return self._destinations_cache

    def get_user_visited_destinations(self, past_trips: List[Dict[str, Any]]) -> set:
        """
        Extract unique destination IDs from past trips.
        Expects past_trips to be a list of trip objects with at least:
        - fromDestinationId (or origin)
        - toDestinationId (or destination)
        """
        visited = set()
        for trip in past_trips:
            # Try to get IDs from common field names
            dest_id = trip.get('toDestinationId') or trip.get('destinationId')
            origin_id = trip.get('fromDestinationId') or trip.get('originId')
            if dest_id:
                visited.add(dest_id)
            if origin_id:
                visited.add(origin_id)
        return visited

    async def get_recommendations(self, past_trips: List[Dict[str, Any]], limit: int = 5) -> List[Dict[str, Any]]:
        """
        Generate destination recommendations based on user's past trips.
        Returns a list of destination objects (from public API) that the user hasn't visited.
        """
        if not past_trips:
            logger.info("No past trips provided, returning popular destinations")
            # If no history, return some popular destinations (first few)
            destinations = await self.get_all_destinations()
            return destinations[:limit]

        visited_ids = self.get_user_visited_destinations(past_trips)
        logger.info(f"User has visited destination IDs: {visited_ids}")

        all_destinations = await self.get_all_destinations()
        # Filter out visited destinations
        unvisited = [d for d in all_destinations if d.get('destinationId') not in visited_ids]

        # If we have visited all destinations, fallback to visited ones (maybe user wants to go again)
        if not unvisited:
            logger.info("User has visited all destinations, recommending visited ones")
            unvisited = all_destinations

        # Sort by destinationId (or maybe by name) and limit
        unvisited.sort(key=lambda x: x.get('destinationId', 0))
        recommended = unvisited[:limit]

        logger.info(f"Returning {len(recommended)} recommendations")
        return recommended