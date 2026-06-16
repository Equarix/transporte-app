import logging
from fastapi import FastAPI
import config
from routers import webhook

# Configurar logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ia-module")

app = FastAPI(title="Módulo de IA para Transporte (Entrafesa)", version="0.1.0")

# Registrar routers
app.include_router(webhook.router)

@app.get("/health")
def health_check():
    """
    Endpoint para validación de estado del servicio.
    """
    return {
        "status": "healthy",
        "openai_configured": bool(config.OPENAI_API_KEY),
        "chatwoot_configured": bool(config.CHATWOOT_API_TOKEN),
        "main_api_url": config.MAIN_API_URL
    }

@app.get("/")
def read_root():
    return {"message": "Módulo de IA de Entrafesa activo. Usa /webhook para Chatwoot."}
