import os
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

# Configuraciones de Chatwoot
CHATWOOT_BASE_URL = os.getenv("CHATWOOT_BASE_URL", "http://localhost:8080").rstrip("/")
CHATWOOT_API_TOKEN = os.getenv("CHATWOOT_API_TOKEN", "")

# Configuraciones de OpenAI / Groq
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", os.getenv("GROQ_API_KEY", ""))
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.groq.com/openai/v1")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "llama-3.3-70b-versatile")


# Configuraciones de la API principal de Transporte
MAIN_API_URL = os.getenv("MAIN_API_URL", "http://localhost:5000/api").rstrip("/")

# Credenciales del Bot para registrarse e iniciar sesión en la API de Transporte
BOT_DOCUMENT_TYPE = os.getenv("BOT_DOCUMENT_TYPE", "DNI")
BOT_DOCUMENT_NUMBER = os.getenv("BOT_DOCUMENT_NUMBER", "99999999")
BOT_PASSWORD = os.getenv("BOT_PASSWORD", "botpassword123")
BOT_FIRST_NAME = os.getenv("BOT_FIRST_NAME", "Bot")
BOT_LAST_NAME = os.getenv("BOT_LAST_NAME", "Entrafesa")
BOT_EMAIL = os.getenv("BOT_EMAIL", "bot@entrafesa.com")
BOT_PHONE = os.getenv("BOT_PHONE", "999999999")
BOT_DATE_OF_BIRTH = os.getenv("BOT_DATE_OF_BIRTH", "2000-01-01")
