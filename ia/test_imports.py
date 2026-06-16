import sys
import os

# Asegurar que la ruta actual está en el path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("Probando importaciones...")
try:
    import config
    print("  [OK] Import config")
    from services.api_client import ApiClient
    print("  [OK] Import ApiClient")
    from services.openai_client import OpenAIClient
    print("  [OK] Import OpenAIClient")
    from main import app
    print("  [OK] Import FastAPI app")
    print("Todas las importaciones exitosas.")
except Exception as e:
    print(f"  [ERROR] Falló alguna importación: {e}")
    sys.exit(1)

# Probar conectividad con la API de NestJS
print("\nProbando conectividad con NestJS API (http://localhost:5000/api)...")
client = ApiClient()
destinations = client.get_destinations()
if destinations:
    print(f"  [OK] Conectado a la API. Destinos encontrados: {len(destinations)}")
    for d in destinations[:3]:
        print(f"       - {d.get('name')} (Slug: {d.get('slug')})")
else:
    print("  [WARNING] No se pudo conectar a la API principal o no hay destinos registrados. Asegúrate de tener levantado el backend en el puerto 5000.")

print("\nVerificación de credenciales del Bot...")
success = client.login_or_register_bot()
if success:
    print("  [OK] El Bot se pudo registrar o iniciar sesión correctamente y obtuvo el JWT Token.")
else:
    print("  [WARNING] No se pudo autenticar al bot. Esto puede pasar si el backend de NestJS o su base de datos no están activos.")

print("\nFin de la prueba.")
