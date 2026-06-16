import sys
import os
import time
from fastapi.testclient import TestClient

# Asegurar que la ruta actual está en el path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

def test_chatwoot_webhook():
    print("Iniciando simulación de Webhook de Chatwoot...")
    
    # Payload simulado de mensaje entrante de Chatwoot
    payload = {
        "event": "message_created",
        "id": 12345,
        "content": "Hola, ¿qué salidas hay de Lima a Trujillo?",
        "message_type": "incoming",
        "conversation": {
            "id": 999
        },
        "account": {
            "id": 1
        },
        "sender": {
            "id": 789,
            "name": "Cliente de Prueba",
            "email": "cliente@pruebas.com"
        }
    }
    
    # Llamamos al endpoint /webhook
    print("Enviando petición POST a /webhook...")
    response = client.post("/webhook", json=payload)
    
    print(f"Respuesta de FastAPI: Código {response.status_code}")
    print(f"Cuerpo: {response.json()}")
    
    assert response.status_code == 202
    assert response.json() == {"status": "received"}
    print("  [OK] Endpoint /webhook responde correctamente 202 (Accepted) de forma inmediata.")
    
    print("\nEsperando 1 segundo para permitir el procesamiento en segundo plano...")
    time.sleep(1)
    print("Simulación completada con éxito.")

if __name__ == "__main__":
    test_chatwoot_webhook()
