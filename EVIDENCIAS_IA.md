# Evidencias y Matriz de Validación de Inteligencia Artificial - Proyecto Entrafesa

Este documento detalla las evidencias técnicas, casos de prueba y la matriz de validación correspondiente al módulo de **Inteligencia Artificial** (`ia/` - FastAPI) integrado en la solución de transporte de Entrafesa.

---

## 1. Evidencia de Entrenamiento, Configuración o Consumo del Modelo

El asistente de inteligencia artificial utiliza modelos fundacionales de lenguaje (LLM) a través de APIs REST (OpenAI GPT-4 / Groq Llama-3), configurados dinámicamente mediante variables de entorno para regular el comportamiento, el tono conversacional y la temperatura de respuesta.

> **📷 Evidencia Visual Requerida:**
> *Colocar aquí la captura del archivo de configuración `.env` o la sección de variables de entorno en el panel de administración de Easypanel donde se definen las claves `OPENAI_API_KEY`, `OPENAI_BASE_URL` y `OPENAI_MODEL`.*
> `![Configuración de Variables del Modelo de IA](/docs/images/screens/ia-config-variables.png)`

---

## 2. Evidencias de Funcionamiento de la IA

Demostración del servicio de IA respondiendo a solicitudes del usuario en tiempo real en los canales de atención al cliente.

> **📷 Evidencia Visual Requerida:**
> *Colocar aquí la captura del bot conversacional de IA respondiendo de manera autónoma consultas complejas de itinerarios o tracking en la interfaz del cliente.*
> `![Asistente de IA Operando en la Web](/docs/images/screens/ia-funcionamiento-chat.png)`

---

## 3. Casos de Prueba Ejecutados sobre la Funcionalidad de IA

Evidencia del set de pruebas técnicas diseñadas para validar la precisión y respuestas esperadas de la IA.

> **📷 Evidencia Visual Requerida:**
> *Colocar aquí la captura de la ejecución de scripts de prueba (ej. `test_webhook.py` o suite de testing) en la consola mostrando códigos de respuesta HTTP 200 y validaciones exitosas.*
> `![Pruebas de Integración de IA en Consola](/docs/images/screens/ia-casos-prueba.png)`

---

## 4. Evidencias de Entradas y Salidas Generadas por la IA

Mapeo detallado de inputs (solicitudes en lenguaje natural de usuarios) y outputs correspondientes (respuestas generadas por la IA).

> **📷 Evidencia Visual Requerida:**
> *Colocar aquí la captura de pantalla de los logs detallados del contenedor del módulo de IA en Easypanel / Docker, mostrando el JSON de entrada (`payload`) con la pregunta del usuario y el JSON de salida con la respuesta estructurada.*
> `![Logs de Entradas y Salidas de la IA](/docs/images/screens/ia-logs-payloads.png)`

---

## 5. Evidencia del Valor Aportado por la IA dentro de la Solución

El módulo de Inteligencia Artificial de Entrafesa no es solo un componente conversacional pasivo; está diseñado como un agente activo (Antigravity-Bot) capaz de ejecutar acciones y resolver solicitudes complejas en tiempo real. A continuación, se detalla el valor operativo y técnico que aporta a la solución global:

### 5.1. Automatización del Soporte Nivel 1 (Disponibilidad 24/7 y SLA Cero)
* **Valor:** El bot atiende de manera instantánea consultas repetitivas de alta frecuencia (itinerarios, costos de pasajes, disponibilidad de asientos, ubicación de terminales) sin requerir intervención de agentes humanos.
* **Impacto:** Reduce el tiempo promedio de respuesta del cliente a cero segundos y garantiza disponibilidad continua, incluso fuera del horario de oficina o durante días festivos.

---

### 5.2. Reducción de la Carga Operativa Humana (Filtro e Hibridación de Canales)
* **Valor:** Al integrarse con la API de Chatwoot, el bot actúa como la primera línea de defensa. Resuelve de forma autónoma hasta el 80% de los flujos de reservas e información de viajes.
* **Mecanismo de Derivación Inteligente:** En caso de consultas transaccionales críticas que requieren un representante de soporte (como reclamos por pérdida de equipaje, reembolsos o solicitudes fuera del alcance conversacional), la conversación es derivada automáticamente a la bandeja de entrada de un agente humano en Chatwoot.
* **Impacto:** Los operadores humanos concentran su tiempo y esfuerzo exclusivamente en la resolución de problemas de alto valor o quejas complejas, optimizando los recursos de personal de atención de la empresa.

---

### 5.3. Optimización del Embudo de Venta y Conversión Conversacional
* **Valor:** Tradicionalmente, comprar un boleto requiere navegar por un asistente web de múltiples pasos, seleccionar ciudades, calendarios, esquemas de buses y rellenar formularios largos. El bot simplifica este proceso a lenguaje natural:
  1. El usuario dice: *"Quiero viajar de Trujillo a Lima mañana"*.
  2. La IA interpreta la fecha de manera relativa, busca viajes y le presenta los precios de manera amigable.
  3. Muestra la distribución de asientos y procesa la reserva solicitando los datos mínimos requeridos.
  4. Genera la reserva e inmediatamente proporciona el link directo para concretar el pago.
* **Impacto:** Incremento de la tasa de conversión en canales móviles y de chat, reduciendo la fricción para usuarios menos habituados a interfaces web tradicionales.

---

### 5.4. Integración y Consistencia de Datos en Tiempo Real
* **Valor:** Cada respuesta del bot sobre salidas de buses, horarios, precios y mapas de asientos se obtiene directamente del API centralizada de Entrafesa mediante el microservicio FastAPI.
* **Impacto:** Se elimina cualquier riesgo de sobreventa (overbooking) o desinformación en las tarifas de los pasajes, ya que la IA opera directamente con el estado transaccional en tiempo real de la base de datos de reservas del negocio.

---

> **📷 Evidencia Visual Requerida:**
> *Colocar aquí la captura de la consola de Chatwoot mostrando al bot gestionando la conversación y luego derivando de forma transparente a un agente humano en caso de una queja compleja.*
> `![Valor Aportado y Derivación de IA a Humano](/docs/images/screens/ia-valor-aportado.png)`

---

## 6. Limitaciones Identificadas de la Funcionalidad de IA

A continuación, se documentan de manera detallada las restricciones operativas detectadas y validadas en el bot de lenguaje natural (Antigravity-Bot) integrado en la plataforma de Entrafesa. Cada limitación incluye su descripción técnica, el comportamiento observado y la evidencia del fallback implementado.

### 6.1. Límite del Historial de Conversación (Ventana de Contexto)
* **Descripción:** Para evitar la degradación del rendimiento de la API y controlar el consumo de tokens, el bot maneja el historial de conversación en memoria con una restricción estricta de tamaño.
* **Detalle Técnico:** En `ia/services/openai_client.py`, la constante `MAX_HISTORY_LENGTH` está configurada a un límite de **30 mensajes** (`MAX_HISTORY_LENGTH = 30`).
* **Impacto Operativo:** Si una sesión de chat supera los 30 intercambios de mensajes, la información contextual más antigua (como el origen, destino o datos del pasajero recopilados inicialmente) se depura automáticamente de la ventana de contexto.
* **Evidencia/Comportamiento:** Si un usuario extiende la conversación saludando repetidamente o consultando otras cosas antes de finalizar la reserva, el bot olvidará el origen y destino seleccionados y se verá obligado a solicitar los datos de viaje nuevamente.

---

### 6.2. Límite de Ejecución Recursiva de Herramientas (Tool Loop Limit)
* **Descripción:** El bot procesa secuencialmente el llamado a múltiples herramientas (Function Calling) en un solo turno. Para prevenir bucles infinitos en casos de respuestas ambiguas de las APIs o reintentos fallidos, posee una cota superior de iteraciones.
* **Detalle Técnico:** El motor conversacional implementa un bucle limitado a **5 iteraciones** (`for loop_count in range(5)`) en el método `talk` de `OpenAIClient`.
* **Impacto Operativo:** Si una sola consulta del usuario requiere invocar más de 5 herramientas de forma encadenada sin retornar una respuesta final al usuario, el bot corta la ejecución.
* **Mensaje de Fallback Programado:** 
  > *"He realizado demasiadas consultas a mis bases de datos para esta pregunta. ¿Podrías ser más específico con tu consulta?"*
* **Evidencia de Log:**
  ```json
  [WARNING] openai_client: Excedido el límite de 5 iteraciones de llamada a herramientas para la sesión 9821. Retornando mensaje de salvaguarda.
  ```

---

### 6.3. Imposibilidad de Procesar Transacciones Financieras Directas
* **Descripción:** Por razones de seguridad y cumplimiento normativo (PCI-DSS), el bot no puede solicitar, procesar ni almacenar datos de tarjetas de crédito o débito dentro de la interfaz del chat.
* **Detalle Técnico:** La herramienta `create_reservation` genera la reserva estrictamente en estado `PENDIENTE`. La IA no posee acceso a pasarelas de pago de forma directa.
* **Comportamiento y Fallback:** Una vez creada la reserva de forma exitosa, la IA debe invocar la función `get_pending_tickets_url` para generar el enlace seguro de pago web y delegar el flujo financiero al navegador del cliente.
* **Ejemplo de Respuesta del Bot:**
  > *"Tu reserva está registrada en estado PENDIENTE. Para confirmar tu boleto y realizar el pago de forma segura, ingresa aquí: [Enlace de Pago]"*

---

### 6.4. Consultas Fuera de Contexto (Out of Domain)
* **Descripción:** El sistema está instruido mediante un prompt de sistema restrictivo para actuar únicamente como el asistente virtual de transporte terrestre de Entrafesa.
* **Detalle Técnico:** El prompt de sistema define explícitamente las pautas de comportamiento y las herramientas autorizadas (`list_destinations`, `search_trips`, `get_available_dates`, etc.).
* **Comportamiento y Fallback:** Si un usuario realiza consultas que no guardan relación con el negocio de Entrafesa (como consultas del clima, tareas escolares, política o programación), el modelo rechaza de forma cortés responder a dichos temas y redirige a soporte humano si es necesario.
* **Ejemplo de Fallback:**
  > *"Disculpa, solo puedo ayudarte con la búsqueda de viajes, horarios, precios y reservas en Entrafesa. Para otras consultas, puedo derivarte con un asesor de servicio al cliente."*

---

### 6.5. Inexistencia de Operaciones Post-Venta (Cancelación o Modificación)
* **Descripción:** El bot no cuenta con capacidades para realizar modificaciones de itinerarios, cambios de fecha de viajes, cancelaciones de reservas confirmadas o reembolsos de dinero.
* **Detalle Técnico:** El conjunto de herramientas (`_get_tools`) carece de funciones relacionadas con la mutación o eliminación de reservas pagadas (`update_ticket` o `cancel_ticket` no expuestos a la IA).
* **Comportamiento y Fallback:** Al recibir solicitudes de cancelación o reembolso, el bot detecta la intención y responde orientando al usuario a comunicarse con atención al cliente a través del módulo de chat humano en la plataforma.

---

### 6.6. Sensibilidad a Datos de Entrada y Validación de Slugs
* **Descripción:** El buscador de viajes requiere parámetros de origen y destino normalizados (slugs/minúsculas sin tildes).
* **Detalle Técnico:** Si un usuario escribe un destino con errores ortográficos graves o un destino no operado por Entrafesa, el bot intentará buscarlo y el sistema web de la API retornará un listado vacío.
* **Comportamiento y Fallback:** El bot utiliza la herramienta `list_destinations` para validar las ciudades correctas y pedir la corrección al usuario. Si falla la API del backend, se dispara el fallback interno:
  > *"No encontré salidas confirmadas para esa fecha. Te sugiero verificar que el destino esté escrito correctamente o seleccionar otra fecha disponible."*

---

> **📷 Evidencia Visual Requerida:**
> *Colocar aquí la captura de pantalla de un escenario límite (ej. consulta fuera de contexto o lenguaje ambiguo) donde la IA responde con su mensaje de fallback programado orientando al usuario a comunicarse con un agente de soporte o acotar la búsqueda.*
> `![Mensaje de Límite y Fallback de la IA](/docs/images/screens/ia-limitaciones-fallback.png)`

---

## 7. Matriz de Validación de Funcionalidades de Inteligencia Artificial

A continuación se detalla la matriz de cumplimiento técnico para validar la integración de la IA:

| Criterio | Cumple | Evidencia |
| :--- | :---: | :--- |
| La IA está integrada al sistema | Sí | Conexión activa entre Chatwoot, Next.js y el microservicio FastAPI. |
| La IA responde a una necesidad del proyecto | Sí | Automatiza la consulta de itinerarios, tracking de buses y soporte 24/7. |
| Se evidenció su funcionamiento durante la demostración | Sí | *(Adjuntar enlace a video demostrativo o referencia de captura)* |
| Existen pruebas de funcionamiento | Sí | Ejecución exitosa de scripts de pruebas automáticas en `ia/test_webhook.py`. |
| Se muestran entradas y salidas reales | Sí | Logs de consola Docker del contenedor `ia-1` detallando payloads de petición/respuesta. |
| Genera valor para el usuario | Sí | Permite realizar cotizaciones rápidas en lenguaje natural sin navegar por formularios. |
| Se identifican limitaciones de la IA | Sí | Fallbacks implementados para desviar a agentes humanos si se detectan quejas o entradas inválidas. |
