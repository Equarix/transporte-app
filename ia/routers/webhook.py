import logging
from fastapi import APIRouter, Request, BackgroundTasks, status
from fastapi.responses import JSONResponse
from services.openai_client import OpenAIClient
from services.chatwoot_service import ChatwootService

logger = logging.getLogger("ia-module.router")
router = APIRouter()
openai_client = OpenAIClient()

def process_webhook_message(payload: dict):
    """
    Tarea en segundo plano para procesar la petición de Chatwoot.
    """
    event = payload.get("event")
    message_type = payload.get("message_type")
    content = payload.get("content")
    
    # Validar que sea un mensaje entrante
    if event != "message_created" or message_type != "incoming":
        logger.debug(f"Ignorando evento no manejado: {event} ({message_type})")
        return

    if not content:
        logger.info("Mensaje entrante sin contenido de texto. Ignorado.")
        return

    conversation = payload.get("conversation", {})
    conversation_id = conversation.get("id")
    account = payload.get("account", {})
    account_id = account.get("id")

    if not conversation_id or not account_id:
        logger.error(f"Datos incompletos de la conversación: conversation_id={conversation_id}, account_id={account_id}")
        return

    sender = payload.get("sender", {})
    sender_name = sender.get("name", "Usuario")
    logger.info(f"Procesando mensaje de {sender_name} en conversación {conversation_id}: {content[:50]}...")

    # Consultar a OpenAI (que maneja las herramientas y bases de datos)
    ai_response = openai_client.talk(conversation_id, content)

    # Enviar respuesta de vuelta a Chatwoot
    ChatwootService.send_message(account_id, conversation_id, ai_response)

@router.post("/webhook", status_code=status.HTTP_202_ACCEPTED)
async def webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Recibe los webhooks enviados por Chatwoot.
    """
    try:
        payload = await request.json()
        logger.debug(f"Webhook recibido: {payload}")
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"status": "error", "message": "JSON inválido"}
        )

    # Agendar procesamiento en segundo plano
    background_tasks.add_task(process_webhook_message, payload)
    
    return {"status": "received"}
