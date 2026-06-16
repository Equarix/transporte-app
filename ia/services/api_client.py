import logging
import requests
import sys
import os
from typing import List, Dict, Any, Optional

# Asegurar importación de config desde la raíz del módulo
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

logger = logging.getLogger(__name__)

class ApiClient:
    def __init__(self):
        self.base_url = config.MAIN_API_URL
        self.jwt_token: Optional[str] = None

    def _get_headers(self, authenticated: bool = False) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if authenticated:
            if not self.jwt_token:
                self.login_or_register_bot()
            if self.jwt_token:
                headers["Authorization"] = f"Bearer {self.jwt_token}"
        return headers

    def login_or_register_bot(self) -> bool:
        """
        Intenta iniciar sesión como bot. Si el usuario no existe (404),
        intenta registrar al bot primero y luego inicia sesión.
        """
        login_url = f"{self.base_url}/public/auth/login"
        register_url = f"{self.base_url}/public/auth/register"

        login_data = {
            "typeDocument": config.BOT_DOCUMENT_TYPE,
            "documentNumber": config.BOT_DOCUMENT_NUMBER,
            "password": config.BOT_PASSWORD
        }

        try:
            logger.info("Intentando iniciar sesión con la cuenta de Bot...")
            response = requests.post(login_url, json=login_data, headers=self._get_headers())
            
            if response.status_code in (200, 201):
                result = response.json()
                self.jwt_token = result.get("token") or result.get("data", {}).get("token")
                logger.info("Sesión de Bot iniciada correctamente.")
                return True
                
            elif response.status_code == 404:
                logger.info("La cuenta de Bot no existe. Registrando cuenta nueva...")
                register_data = {
                    "typeDocument": config.BOT_DOCUMENT_TYPE,
                    "documentNumber": config.BOT_DOCUMENT_NUMBER,
                    "password": config.BOT_PASSWORD,
                    "firstName": config.BOT_FIRST_NAME,
                    "lastName": config.BOT_LAST_NAME,
                    "email": config.BOT_EMAIL,
                    "phone": config.BOT_PHONE,
                    "dateOfBirth": config.BOT_DATE_OF_BIRTH
                }
                
                reg_response = requests.post(register_url, json=register_data, headers=self._get_headers())
                if reg_response.status_code in (200, 201):
                    reg_result = reg_response.json()
                    self.jwt_token = reg_result.get("token") or reg_result.get("data", {}).get("token")
                    logger.info("Cuenta de Bot registrada e iniciada correctamente.")
                    return True
                else:
                    logger.error(f"Error al registrar bot: {reg_response.status_code} - {reg_response.text}")
                    return False
            else:
                logger.error(f"Error al iniciar sesión de bot: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.exception(f"Excepción al autenticar Bot: {str(e)}")
            return False

    def get_destinations(self) -> List[Dict[str, Any]]:
        """
        Obtiene la lista de destinos activos.
        """
        url = f"{self.base_url}/public/destination"
        try:
            response = requests.get(url, headers=self._get_headers())
            if response.status_code == 200:
                res_data = response.json()
                if isinstance(res_data, dict) and "body" in res_data:
                    return res_data["body"]
                elif isinstance(res_data, dict) and "data" in res_data:
                    return res_data["data"]
                return res_data
            else:
                logger.error(f"Error al obtener destinos: {response.status_code} - {response.text}")
                return []
        except Exception as e:
            logger.exception(f"Excepción al obtener destinos: {str(e)}")
            return []

    def search_trips(self, origin: str, destination: str, date: str) -> Dict[str, Any]:
        """
        Busca viajes programados y confirmados entre origen y destino en una fecha (YYYY-MM-DD).
        """
        url = f"{self.base_url}/public/booking/destinations"
        params = {
            "origin": origin.lower().strip(),
            "destination": destination.lower().strip(),
            "checkIn": date
        }
        try:
            response = requests.get(url, params=params, headers=self._get_headers())
            if response.status_code == 200:
                res_data = response.json()
                if isinstance(res_data, dict) and "body" in res_data:
                    return res_data["body"]
                elif isinstance(res_data, dict) and "data" in res_data:
                    return res_data["data"]
                return res_data
            else:
                logger.error(f"Error al buscar viajes: {response.status_code} - {response.text}")
                return {"error": f"Error del servidor: {response.status_code}", "message": response.text}
        except Exception as e:
            logger.exception(f"Excepción al buscar viajes: {str(e)}")
            return {"error": "Exception occurred", "message": str(e)}

    def get_bus_layout(self, reserver_id: int) -> Dict[str, Any]:
        """
        Obtiene el diseño del bus y disponibilidad de asientos para una reservación específica.
        """
        url = f"{self.base_url}/public/booking/bus/{reserver_id}"
        try:
            response = requests.get(url, headers=self._get_headers())
            if response.status_code == 200:
                res_data = response.json()
                if isinstance(res_data, dict) and "body" in res_data:
                    return res_data["body"]
                elif isinstance(res_data, dict) and "data" in res_data:
                    return res_data["data"]
                return res_data
            else:
                logger.error(f"Error al obtener layout del bus: {response.status_code} - {response.text}")
                return {"error": f"Error del servidor: {response.status_code}", "message": response.text}
        except Exception as e:
            logger.exception(f"Excepción al obtener layout del bus: {str(e)}")
            return {"error": "Exception occurred", "message": str(e)}

    def get_available_dates(self, origin: str, destination: str) -> List[str]:
        """
        Obtiene las fechas que tienen salidas confirmadas entre un origen y destino.
        """
        url = f"{self.base_url}/public/booking/available-dates"
        params = {
            "origin": origin.lower().strip(),
            "destination": destination.lower().strip()
        }
        try:
            response = requests.get(url, params=params, headers=self._get_headers())
            if response.status_code == 200:
                res_data = response.json()
                if isinstance(res_data, dict) and "body" in res_data:
                    return res_data["body"]
                elif isinstance(res_data, dict) and "data" in res_data:
                    return res_data["data"]
                return res_data
            else:
                logger.error(f"Error al obtener fechas disponibles: {response.status_code} - {response.text}")
                return []
        except Exception as e:
            logger.exception(f"Excepción al obtener fechas disponibles: {str(e)}")
            return []

    def create_reservation(
        self,
        reserver_id: int,
        bus_id: int,
        from_destination_id: int,
        to_destination_id: int,
        payer_doc_type: str,
        payer_doc_number: str,
        payer_first_name: str,
        payer_last_name: str,
        payer_birth_date: str,
        payer_email: str,
        payer_phone: str,
        passenger_doc_type: str,
        passenger_doc_number: str,
        passenger_first_name: str,
        passenger_last_name: str,
        passenger_birth_date: str,
        seat_id: int,
        floor: int,
        row: int,
        column: int,
        price: float,
        type_seat: str = "asiento"
    ) -> Dict[str, Any]:
        """
        Realiza la reserva de un asiento en estado PENDIENTE.
        """
        url = f"{self.base_url}/public/booking/pay"
        
        payload = {
            "reserverId": reserver_id,
            "busId": bus_id,
            "fromDestinationId": from_destination_id,
            "toDestinationId": to_destination_id,
            "payer": {
                "documentType": payer_doc_type,
                "documentNumber": payer_doc_number,
                "names": payer_first_name,
                "lastName": payer_last_name,
                "birthDate": payer_birth_date,
                "email": payer_email,
                "phone": payer_phone
            },
            "paymentMethod": {
                "provider": "CHATBOT",
                "type": "EFECTIVO"
            },
            "passengers": [
                {
                    "documentType": passenger_doc_type,
                    "documentNumber": passenger_doc_number,
                    "names": passenger_first_name,
                    "lastName": passenger_last_name,
                    "motherLastName": "",
                    "gender": "M",
                    "birthDate": passenger_birth_date,
                    "seatId": seat_id,
                    "name": f"{passenger_first_name} {passenger_last_name}",
                    "typeSeat": type_seat,
                    "status": True,
                    "row": row,
                    "column": column,
                    "floor": floor,
                    "type": "NORMAL",
                    "price": price
                }
            ]
        }

        try:
            response = requests.post(url, json=payload, headers=self._get_headers(authenticated=True))
            
            if response.status_code == 401:
                logger.info("Token JWT expirado o inválido. Re-autenticando bot...")
                if self.login_or_register_bot():
                    response = requests.post(url, json=payload, headers=self._get_headers(authenticated=True))
            
            if response.status_code in (200, 201):
                res_data = response.json()
                if isinstance(res_data, dict) and "body" in res_data:
                    return res_data["body"]
                elif isinstance(res_data, dict) and "data" in res_data:
                    return res_data["data"]
                return res_data
            else:
                logger.error(f"Error al crear reserva: {response.status_code} - {response.text}")
                return {"error": f"Error del servidor: {response.status_code}", "message": response.text}
                
        except Exception as e:
            logger.exception(f"Excepción al crear reserva: {str(e)}")
            return {"error": "Exception occurred", "message": str(e)}

    def get_pending_tickets_url(self) -> str:
        """
        Devuelve la URL de la pestaña de pagos pendientes en el perfil del usuario.
        """
        app_url = getattr(config, 'APP_URL', 'http://localhost:3000')
        return f"{app_url}/perfil?tab=pending"
