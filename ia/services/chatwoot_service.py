import logging
import requests
import sys
import os

# Asegurar importación de config desde la raíz
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config

logger = logging.getLogger(__name__)

class ChatwootService:
    @staticmethod
    def send_message(account_id: int, conversation_id: int, text: str):
        """
        Envía una respuesta de texto a Chatwoot llamando a su API de mensajes.
        """
        if not config.CHATWOOT_API_TOKEN:
            logger.error("No se puede enviar mensaje a Chatwoot: CHATWOOT_API_TOKEN no está configurada.")
            return

        url = f"{config.CHATWOOT_BASE_URL}/api/v1/accounts/{account_id}/conversations/{conversation_id}/messages"
        headers = {
            "api_access_token": config.CHATWOOT_API_TOKEN,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        payload = {
            "content": text,
            "message_type": "outgoing",
            "private": False
        }

        try:
            logger.info(f"Enviando respuesta a Chatwoot (Conversación: {conversation_id})...")
            response = requests.post(url, json=payload, headers=headers)
            if response.status_code in (200, 201):
                logger.info("Respuesta enviada correctamente a Chatwoot.")
            else:
                logger.error(f"Error al enviar mensaje a Chatwoot: {response.status_code} - {response.text}")
        except Exception as e:
            logger.exception("Excepción al enviar mensaje a Chatwoot.")
