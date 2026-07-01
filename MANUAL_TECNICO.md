# Manual Técnico del Sistema - Proyecto Entrafesa

Este manual de ingeniería proporciona una especificación técnica profunda sobre la infraestructura, persistencia de datos, flujos de integración, estándares de desarrollo y mantenimiento del ecosistema Entrafesa. Está diseñado para desarrolladores de software, ingenieros de DevOps y administradores de sistemas.

---

## 1. Requisitos del Entorno y Configuración de Infraestructura

Para ejecutar y compilar el sistema de forma local o en entornos de staging y producción, se requiere la provisión del siguiente stack de software:

### 1.1 Stack de Software y Herramientas Obligatorias
*   **Runtime de JavaScript:** Node.js versión 18.x o superior (LTS recomendado).
*   **Gestor de Dependencias:** pnpm versión 9.x para la administración de workspaces.
*   **Lenguaje de Programación:** TypeScript 5.x para backends y frontends, y Python 3.10+ para el servicio de inteligencia artificial.
*   **Motores de Base de Datos:** Microsoft SQL Server (MSSQL) versión 2019 o superior.
*   **Message Broker y Caché:** Redis versión 7.x para eventos de microservicios y estado conversacional.
*   **Virtualización y Orquestación:** Docker y Docker Compose (v2.x) para el levantamiento de dependencias locales.

### 1.2 Configuración Detallada de Chatwoot e Infraestructura Auxiliar
El entorno de Chatwoot para soporte al cliente se levanta mediante el archivo `docker-compose.yml` en la raíz. La configuración detalla los siguientes servicios en red común:

*   **postgres (pgvector/pgvector:pg15):** Motor relacional optimizado para embeddings y búsqueda semántica en la base de datos de Chatwoot.
*   **redis (redis:7):** Actúa como base de datos en memoria para Sidekiq (cola de tareas de Chatwoot) y además es compartido para el transporte Pub/Sub de microservicios.
*   **chatwoot (chatwoot/chatwoot:latest):** Contenedor de la aplicación principal. Expone el panel de control administrativo y de agentes en el puerto `8080` (mapeado desde el puerto interno `3000`).
*   **chatwoot-worker:** Servicio Sidekiq encargado de procesar notificaciones por correo, llamadas de webhooks y almacenamiento de transcripciones en segundo plano.

---

## 2. Configuración de Variables de Entorno por Componente

Cada servicio del monorepo requiere variables específicas. La configuración del entorno se realiza creando un archivo `.env` en el directorio raíz de cada aplicación basándose en las siguientes directrices:

### 2.1 Módulo Core API (api/.env)
Este servicio se conecta con la base de datos maestra y expone la API general del negocio.
*   `PORT`: Puerto del servidor web (por defecto `3000`).
*   `DATABASE_URL`: Cadena de conexión JDBC/ODBC para MSSQL (ej. `sqlserver://sa:Password@localhost:1433/EntrafesaCore`).
*   `JWT_SECRET`: Clave simétrica secreta para firma y verificación de tokens.
*   `REDIS_HOST` y `REDIS_PORT`: Dirección y puerto del broker Redis (ej. `localhost` y `6379`).

### 2.2 Microservicio de Ventas (api-sales/.env)
Este microservicio requiere acceso exclusivo a su persistencia de ventas y al bus de eventos de Redis.
*   `PORT`: Puerto del microservicio (por defecto `3001` o puerto configurado para el transporte).
*   `DATABASE_URL`: Cadena de conexión para la base de datos de ventas (ej. `sqlserver://sa:Password@localhost:1433/EntrafesaSales`).
*   `REDIS_HOST` y `REDIS_PORT`: Datos de conexión al broker Redis común para recibir los eventos Pub/Sub.

### 2.3 Módulo de Inteligencia Artificial (ia/.env)
Controla la automatización de chats y la lógica inteligente de respuesta.
*   `OPENAI_API_KEY`: Credencial privada de acceso a la API de OpenAI.
*   `CHATWOOT_API_TOKEN`: Token de autenticación de agente para interactuar con la API REST de Chatwoot.
*   `CHATWOOT_URL`: Dirección HTTP de la instancia local o remota de Chatwoot (ej. `http://localhost:8080`).
*   `MAIN_API_URL`: URL del backend Core para validación de rutas y buses (ej. `http://localhost:3000`).

---

## 3. Arquitectura del Monorepo y Flujos de Construcción (Turborepo)

La configuración del monorepo optimiza el tiempo de compilación y las dependencias cruzadas usando pnpm Workspaces y Turborepo.

### 3.1 Definición de Workspaces (pnpm-workspace.yaml)
El archivo define la ubicación de los subproyectos del sistema:
```yaml
packages:
  - "api"           # NestJS Core
  - "api-sales"     # NestJS Ventas
  - "dashboard"     # React + Vite Admin
  - "ui"            # Next.js Web Pública
  - "packages/dtos" # DTOs Compartidos TypeScript
  - "ia"            # FastAPI Python
```

### 3.2 Administración de Compilaciones (turbo.json)
Turborepo estructura las tareas de forma dependiente mediante topologías de red de dependencias:
*   **build:** Configura la propiedad `dependsOn: ["^build"]` indicando que los paquetes locales (como `@transporte/dtos`) deben compilarse a JavaScript en su directorio `dist/` antes de que el backend o frontend dependiente comience su proceso de build. Las salidas de compilación se almacenan en caché local (`dist/**` y `.next/**`).
*   **dev:** Ejecuta tareas en paralelo sin almacenar resultados en caché (`"cache": false`) para permitir el hot-reloading continuo de archivos en desarrollo.
*   **lint:** Ejecuta validaciones estáticas del código sin dependencias directas de orden de construcción.

---

## 4. Diseño y Persistencia de Datos (Segregación de Base de Datos)

El sistema utiliza Microsoft SQL Server (MSSQL) con una estrategia de **Bases de Datos Segregadas** para evitar cuellos de botella y acoplamiento de almacenamiento de datos.

### 4.1 Base de Datos Core (Servicio api)
Almacena y mantiene el estado maestro de la infraestructura de transporte.
*   **Tabla Agency (Agencias):** Contiene el identificador de la agencia, nombre, ubicación geográfica y estado operativo.
*   **Tabla Bus (Buses):** Almacena el número de placa, capacidad de pasajeros, distribución física por pisos e identificador de conductor.
*   **Tabla Floor & Seat (Pisos y Asientos):** Relación uno a muchos para diagramar la ubicación física tridimensional de cada asiento (fila, columna, número de piso).
*   **Tabla Destination (Destinos):** Define el origen, destino, precio base y horas programadas de salida y llegada.

### 4.2 Base de Datos de Ventas (Servicio api-sales)
Diseñada para transacciones y procesamiento rápido de operaciones comerciales.
*   **Tabla Sales (Ventas):** Almacena el identificador único de la transacción, código de pasajes comprados, precio final pagado y estado del cobro.
*   **Tabla Promos (Promociones):** Administra códigos de descuento, porcentajes y límites de vigencia.
*   **Tabla PointsUser (Fidelización):** Mapeo de puntaje acumulado por número de identificación de usuario.
*   **Tabla Resena (Reseñas):** Calificaciones y comentarios cualitativos del servicio.

### 4.3 Mecanismo de Sincronización e Intercambio (Redis Pub/Sub)
Dado que las bases de datos están segregadas, la sincronización se realiza mediante mensajería asíncrona:
*   Cuando un cliente realiza un pago a través del frontend, la transacción es procesada por `api-sales` (escribiendo en la base de datos de ventas).
*   Tras confirmarse la venta, `api-sales` publica un mensaje en Redis en el canal `sale_confirmed` con la información del pasajero y asiento comprado.
*   El servicio `api` (Core), que se encuentra escuchando dicho canal mediante `@MessagePattern('sale_confirmed')`, bloquea el asiento respectivo de forma permanente en la base de datos maestra y actualiza el estado de la reserva.

---

## 5. Arquitectura del Módulo de Inteligencia Artificial (FastAPI)

El módulo en `/ia` gestiona de forma aislada las interacciones conversacionales integrando Chatwoot como CRM y OpenAI como cerebro conversacional.

### 5.1 Flujo Conversacional del Webhook de Chatwoot
```
[Mensaje Cliente] -> (Chatwoot Inbox) 
                        | (Webhook HTTP POST)
                        v
                 [ia/routers/webhook.py]
                        | (Valida y Extrae Contenido)
                        v
             [ia/services/openai_client.py] <--> [Historial de Chat (Redis)]
                        | (Petición con Contexto)
                        v
                 [OpenAI GPT API]
                        | (Generación de Respuesta)
                        v
             [ia/services/chatwoot_service.py]
                        | (HTTP POST Send Message)
                        v
                 (Chatwoot API) -> [Mensaje Enviado al Cliente]
```

### 5.2 Estructura y Responsabilidad de Routers
*   **webhook.py:** Maneja las llamadas entrantes enviadas por Chatwoot. Filtra los mensajes para evitar bucles infinitos (mensajes generados por la propia aplicación o agentes humanos).
*   **recommendations.py:** Lógica estructurada para recomendar paquetes de viaje y destinos frecuentes interactuando con la base de datos a través de peticiones HTTP hacia `api` Core.
*   **tracking.py:** Integra servicios de rastreo y horarios para proveer respuestas al instante sobre el estatus de llegada de los buses.
*   **alerts.py:** Envía mensajes masivos inteligentes y personalizados cuando se detectan demoras en itinerarios de viaje.

---

## 6. Estándares y Directrices de Desarrollo de Código

Para asegurar la mantenibilidad y consistencia del proyecto, todo desarrollador debe acatar los siguientes estándares de desarrollo de software:

### 6.1 Reglas Estrictas para React (dashboard y ui)
*   **Modularidad de Componentes:** Todo componente debe tener una única responsabilidad (SRP). Los archivos extensos con múltiples renderizados locales deben dividirse en subcomponentes atómicos (por ejemplo: `UserCard`, `UserAvatar`, `UserInfo`).
*   **Firma de Parámetros Limpia:** Los componentes no deben aceptar más de 5 a 7 propiedades (props). Si un componente requiere parametrización masiva, se debe agrupar la información en un objeto tipado (ej. `user={userData}`) o aplicar composición mediante `children`.
*   **Formularios Tipados:** Queda prohibido el uso de `useState` manual o lógica nativa de `onChange` para formularios. Todo formulario debe usar `React Hook Form` acoplado con esquemas de validación `Zod` mediante `zodResolver`.
*   **Validaciones en Español:** Los mensajes de error y feedback de Zod deben redactarse explícitamente en español (ej. `z.string().min(8, "La contraseña debe poseer un mínimo de 8 caracteres")`).

### 6.2 Reglas para TypeScript y Control de Tipado
*   **Prohibición de any y unknown:** Se prohíbe el uso de `any` y `unknown` en cualquier parte del código (componentes, hooks, servicios o firmas de métodos). Todo tipo de dato debe estar estructurado explícitamente mediante interfaces o genéricos tipados.
*   **Tratamiento de Respuestas Externas:** Al obtener respuestas de APIs externas, el desarrollador debe mapear la estructura a una interfaz específica utilizando una capa adapter si es necesario para evitar propagar tipos dinámicos e inseguros al resto del software.
*   **Modo Estricto:** La aplicación debe compilar con `"strict": true` en el `tsconfig.json` del monorepo y no se deben suprimir errores con comentarios como `// @ts-ignore`.

---

## 7. Solución de Problemas y Diagnósticos Frecuentes

### 7.1 Mitigación de Fallos de Seguridad y Rendimiento Conocidos

*   **Vulnerabilidad:** Escalación de privilegios (BFLA) en endpoints de alertas masivas.
    *   *Acción correctiva:* Verificar que los controladores hereden de clases base con restricciones o colocar los decoradores de acceso basados en roles `@Auth(RoleEnum.ADMIN)` directamente en el método sensible, sobrescribiendo los permisos laxos a nivel de clase.
*   **Problema de Rendimiento:** Desbordamiento de memoria RAM al enviar notificaciones masivas debido a la carga masiva en memoria de toda la colección de registros con `Repository.find()`.
    *   *Acción correctiva:* Implementar procesamiento en bloques (chunks) o paginado paginando consultas con compensaciones (`skip` y `take`), o idealmente mediante pipelines de lectura asíncrona (streams de base de datos) para procesar y liberar la memoria RAM periódicamente.
*   **Vulnerabilidad:** Spoofing de webhook de Chatwoot en el servicio de IA.
    *   *Acción correctiva:* Implementar un middleware o filtro en el router de FastAPI que lea las firmas de las cabeceras HTTP de origen y las compare con el token interno secreto (`CHATWOOT_API_TOKEN`) mediante algoritmos HMAC.
*   **Problema de Rendimiento:** Fuga de memoria en el bot conversacional de IA por almacenamiento indefinido de conversaciones en memoria principal.
    *   *Acción correctiva:* Configurar una persistencia intermedia en Redis utilizando tipos de datos Key-Value tradicionales asociados con un TTL (Time-To-Live) de expiración automática de 30 a 60 minutos por sesión conversacional inactiva.
