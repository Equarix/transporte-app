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

Demostración de cómo la IA automatiza el soporte y asiste al usuario final de manera inteligente reduciendo la carga operativa humana.

> **📷 Evidencia Visual Requerida:**
> *Colocar aquí la captura de la consola de Chatwoot mostrando al bot gestionando la conversación y luego derivando de forma transparente a un agente humano en caso de una queja compleja.*
> `![Valor Aportado y Derivación de IA a Humano](/docs/images/screens/ia-valor-aportado.png)`

---

## 6. Limitaciones Identificadas de la Funcionalidad de IA

Documentación y evidencias de las restricciones operativas detectadas en el bot de lenguaje natural.

> **📷 Evidencia Visual Requerida:**
> *Colocar aquí la captura de pantalla de un escenario límite (ej. consulta fuera de contexto o lenguaje ambiguo) donde la IA responde con su mensaje de fallback programado orientando al usuario a comunicarse con un agente de soporte.*
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
