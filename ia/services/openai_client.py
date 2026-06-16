import logging
import json
import sys
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from openai import OpenAI

# Asegurar importación de config y api_client desde la raíz/servicios
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config
from services.api_client import ApiClient

logger = logging.getLogger(__name__)

# Historial de conversaciones en memoria
CHAT_SESSIONS: Dict[int, List[Dict[str, Any]]] = {}
MAX_HISTORY_LENGTH = 30

class OpenAIClient:
    def __init__(self):
        self.api_key = config.OPENAI_API_KEY
        self.base_url = config.OPENAI_BASE_URL
        self.model = config.OPENAI_MODEL
        self.api_client = ApiClient()
        
        if not self.api_key:
            logger.warning("ATENCIÓN: OPENAI_API_KEY (o GROQ_API_KEY) no está configurada en las variables de entorno.")

        # Inicializar el cliente oficial de OpenAI / Groq
        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url
        )

    def _get_system_instruction(self) -> str:
        current_date = datetime.now().strftime("%Y-%m-%d")
        return (
            f"Eres 'Antigravity-Bot', el asistente virtual inteligente de la empresa peruana de transporte terrestre de pasajeros **Entrafesa**.\n"
            f"Tu objetivo es ayudar a los clientes con sus consultas y permitirles buscar viajes, ver la distribución del bus y reservar sus boletos en tiempo real.\n\n"
            f"PAUTAS DE COMPORTAMIENTO:\n"
            f"1. Saluda amablemente, sé cortés, claro y habla en español.\n"
            f"2. Si el usuario te saluda, dale la bienvenida a Entrafesa y explícale brevemente en qué puedes ayudarle (ej. buscar salidas, horarios, precios, reservar boletos).\n"
            f"3. Para buscar viajes o salidas, primero debes validar o listar los destinos disponibles para ver las ciudades correctas utilizando la herramienta `list_destinations`. Si te preguntan de forma ambigua, diles qué ciudades están disponibles.\n"
            f"4. Si el usuario desea viajar de una ciudad a otra (ej. de Lima a Trujillo), pídele la fecha del viaje si no la ha especificado.\n"
            f"   - NOTA: La fecha de hoy es {current_date}. Úsala como referencia si te dicen 'hoy', 'mañana' o días relativos.\n"
            f"   - Si no especifican el año, asume el año actual.\n"
            f"5. Llama a `search_trips` con el origen, destino y fecha en formato YYYY-MM-DD. Asegúrate de slugificar o pasar los nombres de ciudades en minúsculas y sin acentos si es necesario, o tal como los ves en la lista de destinos.\n"
            f"6. Si el usuario te pregunta qué días o fechas están disponibles para viajar entre dos ciudades, utiliza la herramienta `get_available_dates` para consultar los días con salidas y respóndele con el listado de fechas encontradas.\n"
            f"7. Muestra los viajes disponibles encontrados de forma amigable (ej. hora de salida, precio del primer piso, precio del segundo piso, bus ID, etc.).\n"
            f"8. Para elegir asiento, pídele al usuario que elija uno y consulta la disponibilidad llamando a `get_bus_layout` con el `reserverId` (ID de reservación/viaje) del viaje seleccionado por el usuario.\n"
            f"9. Muestra los asientos libres del bus (número de asiento, piso, precio) de forma amigable y pídele que escoja uno. Ignora o no menciones asientos que no tengan typeSeat como 'asiento' (ej. limpieza, escalera).\n"
            f"10. Una vez elegido el asiento, solicita los datos necesarios para realizar la reserva:\n"
            f"   - Tipo de documento (DNI, PASSPORT, etc.) y número de documento.\n"
            f"   - Nombres y Apellidos.\n"
            f"   - Correo electrónico y Teléfono.\n"
            f"   - Fecha de nacimiento (YYYY-MM-DD).\n"
            f"   (Puedes sugerir usar los mismos datos de pasajero como comprador si es la misma persona para agilizar el proceso).\n"
            f"11. Una vez que tengas todos los datos, realiza la reserva llamando a `create_reservation` con toda la información técnica que obtuviste de `get_bus_layout` (seatId, row, column, floor, price, busId) y los datos personales del usuario.\n"
            f"12. Al finalizar con éxito, confirma la reserva indicando el código/ID de la venta y resúmele los detalles del viaje (origen, destino, fecha, asiento, pasajero y estado PENDIENTE). Explícale al usuario que su reserva está registrada en estado PENDIENTE y que debe proceder a pagarla o completarla para confirmar su boleto.\n"
            f"13. Si una herramienta te da un error o no encuentra datos, explícaselo amablemente al usuario (ej. 'No encontré salidas confirmadas para esa fecha') e invítalo a consultar otra opción.\n"
        )

    def _get_tools(self) -> List[Dict[str, Any]]:
        return [
            {
                "type": "function",
                "function": {
                    "name": "list_destinations",
                    "description": "Obtiene las ciudades disponibles en el sistema de transporte de Entrafesa."
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "search_trips",
                    "description": "Busca las salidas disponibles (viajes programados) entre un origen y destino para una fecha específica.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "origin": {"type": "string", "description": "Nombre o slug de la ciudad de origen (ej. 'lima')"},
                            "destination": {"type": "string", "description": "Nombre o slug de la ciudad de destino (ej. 'trujillo')"},
                            "date": {"type": "string", "description": "Fecha de viaje en formato YYYY-MM-DD (ej. '2026-06-16')"}
                        },
                        "required": ["origin", "destination", "date"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_available_dates",
                    "description": "Obtiene los días (fechas disponibles en formato YYYY-MM-DD) en los que hay salidas confirmadas entre un origen y un destino.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "origin": {"type": "string", "description": "Nombre o slug del origen (ej. 'lima')"},
                            "destination": {"type": "string", "description": "Nombre o slug del destino (ej. 'trujillo')"}
                        },
                        "required": ["origin", "destination"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_bus_layout",
                    "description": "Obtiene la distribución de asientos y precios del bus de un viaje específico usando su ID de reservación (reserverId).",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "reserver_id": {"type": "integer", "description": "ID de la reservación programada (reserverId) obtenido al buscar viajes."}
                        },
                        "required": ["reserver_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "create_reservation",
                    "description": "Registra una reserva de asiento en estado PENDIENTE para el cliente. Requiere que el usuario haya seleccionado un viaje, un asiento disponible del layout, y proporcionado sus datos personales.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "reserver_id": {"type": "integer", "description": "ID de la reservación programada (reserverId)"},
                            "bus_id": {"type": "integer", "description": "ID del bus de la reservación"},
                            "from_destination_id": {"type": "integer", "description": "ID del destino de origen"},
                            "to_destination_id": {"type": "integer", "description": "ID del destino de llegada"},
                            "payer_doc_type": {"type": "string", "description": "Tipo de documento del comprador (ej. 'DNI')"},
                            "payer_doc_number": {"type": "string", "description": "Número de documento del comprador"},
                            "payer_first_name": {"type": "string", "description": "Nombre del comprador"},
                            "payer_last_name": {"type": "string", "description": "Apellido del comprador"},
                            "payer_birth_date": {"type": "string", "description": "Fecha de nacimiento del comprador (YYYY-MM-DD)"},
                            "payer_email": {"type": "string", "description": "Email del comprador"},
                            "payer_phone": {"type": "string", "description": "Teléfono del comprador"},
                            "passenger_doc_type": {"type": "string", "description": "Tipo de documento del pasajero"},
                            "passenger_doc_number": {"type": "string", "description": "Número de documento del pasajero"},
                            "passenger_first_name": {"type": "string", "description": "Nombre del pasajero"},
                            "passenger_last_name": {"type": "string", "description": "Apellido del pasajero"},
                            "passenger_birth_date": {"type": "string", "description": "Fecha de nacimiento del pasajero (YYYY-MM-DD)"},
                            "seat_id": {"type": "integer", "description": "ID del asiento seleccionado (seatId)"},
                            "floor": {"type": "integer", "description": "Número del piso del asiento"},
                            "row": {"type": "integer", "description": "Fila del asiento"},
                            "column": {"type": "integer", "description": "Columna del asiento"},
                            "price": {"type": "number", "description": "Precio del boleto"},
                            "type_seat": {"type": "string", "description": "Tipo de asiento"}
                        },
                        "required": [
                            "reserver_id", "bus_id", "from_destination_id", "to_destination_id",
                            "payer_doc_type", "payer_doc_number", "payer_first_name", "payer_last_name",
                            "payer_birth_date", "payer_email", "payer_phone",
                            "passenger_doc_type", "passenger_doc_number", "passenger_first_name",
                            "passenger_last_name", "passenger_birth_date", "seat_id", "floor", "row", "column", "price"
                        ]
                    }
                }
            }
        ]

    def _execute_tool(self, name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ejecuta la función interna correspondiente a partir del llamado de OpenAI.
        """
        logger.info(f"Ejecutando herramienta {name} con argumentos: {args}")
        try:
            if name == "list_destinations":
                destinations = self.api_client.get_destinations()
                return {"destinations": [{"destinationId": d["destinationId"], "name": d["name"], "slug": d["slug"]} for d in destinations]}
                
            elif name == "search_trips":
                trips_data = self.api_client.search_trips(
                    origin=args.get("origin"),
                    destination=args.get("destination"),
                    date=args.get("date")
                )
                return {"result": trips_data}
                
            elif name == "get_available_dates":
                dates = self.api_client.get_available_dates(
                    origin=args.get("origin"),
                    destination=args.get("destination")
                )
                return {"available_dates": dates}
                
            elif name == "get_bus_layout":
                layout_data = self.api_client.get_bus_layout(
                    reserver_id=args.get("reserver_id")
                )
                return {"result": layout_data}
                
            elif name == "create_reservation":
                reservation_data = self.api_client.create_reservation(
                    reserver_id=args.get("reserver_id"),
                    bus_id=args.get("bus_id"),
                    from_destination_id=args.get("from_destination_id"),
                    to_destination_id=args.get("to_destination_id"),
                    payer_doc_type=args.get("payer_doc_type"),
                    payer_doc_number=args.get("payer_doc_number"),
                    payer_first_name=args.get("payer_first_name"),
                    payer_last_name=args.get("payer_last_name"),
                    payer_birth_date=args.get("payer_birth_date"),
                    payer_email=args.get("payer_email"),
                    payer_phone=args.get("payer_phone"),
                    passenger_doc_type=args.get("passenger_doc_type"),
                    passenger_doc_number=args.get("passenger_doc_number"),
                    passenger_first_name=args.get("passenger_first_name"),
                    passenger_last_name=args.get("passenger_last_name"),
                    passenger_birth_date=args.get("passenger_birth_date"),
                    seat_id=args.get("seat_id"),
                    floor=args.get("floor"),
                    row=args.get("row"),
                    column=args.get("column"),
                    price=args.get("price"),
                    type_seat=args.get("type_seat", "asiento")
                )
                return {"result": reservation_data}
                
            else:
                return {"error": f"Herramienta '{name}' no encontrada."}
        except Exception as e:
            logger.exception(f"Error al ejecutar herramienta {name}")
            return {"error": str(e)}

    def talk(self, conversation_id: int, user_message: str) -> str:
        """
        Envia un mensaje a OpenAI / Groq, maneja el historial de chat de la sesión
        y procesa recursivamente cualquier function calling hasta retornar el texto final.
        """
        if conversation_id not in CHAT_SESSIONS:
            CHAT_SESSIONS[conversation_id] = []
            
        session = CHAT_SESSIONS[conversation_id]
        
        session.append({
            "role": "user",
            "content": user_message
        })
        
        if len(session) > MAX_HISTORY_LENGTH:
            session[:] = session[-MAX_HISTORY_LENGTH:]

        # El mensaje de sistema se inserta al principio de la petición a la API
        messages = [{"role": "system", "content": self._get_system_instruction()}] + session

        for loop_count in range(5):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    tools=self._get_tools(),
                    tool_choice="auto"
                )
                
                response_message = response.choices[0].message
                
                # Convertimos el mensaje a dict para agregarlo al historial y mantener consistencia
                msg_dict = response_message.model_dump(exclude_none=True)
                
                # Quitar atributos vacíos de los tool_calls si existen para evitar errores en llamadas subsecuentes
                if "tool_calls" in msg_dict:
                    # En algunos proveedores, 'function' requiere argumentos serializados string.
                    # Pydantic model_dump ya lo maneja bien.
                    pass
                
                messages.append(msg_dict)
                session.append(msg_dict)
                
                tool_calls = response_message.tool_calls
                if not tool_calls:
                    return response_message.content or "Consulta procesada."
                
                # Procesar cada llamada a función de forma secuencial
                for tool_call in tool_calls:
                    function_name = tool_call.function.name
                    function_args = json.loads(tool_call.function.arguments)
                    
                    tool_result = self._execute_tool(function_name, function_args)
                    
                    tool_response_msg = {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": function_name,
                        "content": json.dumps(tool_result)
                    }
                    messages.append(tool_response_msg)
                    session.append(tool_response_msg)
                    
            except Exception as e:
                logger.exception("Error al comunicarse con la API de OpenAI / Groq.")
                return "Disculpa, he tenido una falla de comunicación interna. Por favor, reintenta tu pregunta."
                
        return "He realizado demasiadas consultas a mis bases de datos para esta pregunta. ¿Podrías ser más específico con tu consulta?"
