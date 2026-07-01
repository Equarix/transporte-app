# Evidencias del Sistema e Interfaces - Proyecto Entrafesa

Este documento constituye el compendio oficial de evidencias visuales y descripción técnica de las interfaces de usuario del sistema **Entrafesa**. Está estructurado para servir como documento de validación de entrega final del producto, detallando cada una de las pantallas y funcionalidades implementadas en el portal del cliente, el panel de administración y el asistente de Inteligencia Artificial.

---

## 1. Introducción y Propósito del Documento

El objetivo de este documento es evidenciar la correcta implementación y el despliegue del ecosistema de software **Entrafesa**. A continuación, se presenta un inventario exhaustivo de las pantallas que componen la solución tecnológica, organizadas por módulos funcionales. 

Cada sección incluye:
* **Ficha Técnica de la Pantalla:** Descripción, tecnología empleada, reglas de negocio asociadas y endpoints consumidos.
* **Espacio para Evidencia Visual:** Indicaciones precisas y placeholders etiquetados para adjuntar las capturas de pantalla de la interfaz ejecutándose en producción.

---

## 2. Portal Público del Cliente (Módulo `ui/` - Next.js)

Esta sección engloba las interfaces orientadas al cliente final, diseñadas con un enfoque responsivo móvil-primero para facilitar la adquisición de pasajes y la autogestión de usuarios.

### 2.1 Pantalla de Búsqueda de Itinerarios (Home)
* **Descripción:** Pantalla de bienvenida que permite al usuario seleccionar las agencias de origen, destino y la fecha para consultar disponibilidad de viajes.
* **Componentes Clave:** Selectores desplegables inteligentes, calendario con bloqueo de fechas pasadas y botón de búsqueda de alta prioridad visual.
* **Reglas de Negocio:** Validación estricta mediante Zod para impedir envíos sin completar los parámetros mínimos.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla limpia de la página de inicio, mostrando los campos interactivos de Origen y Destino completos.*
> `![Pantalla de Búsqueda de Itinerarios](/docs/images/screens/cliente-home-busqueda.png)`

---

### 2.2 Pantalla de Resultados y Filtros
* **Descripción:** Muestra el catálogo de itinerarios que coinciden con los criterios de búsqueda seleccionados.
* **Componentes Clave:** Sidebar de filtros dinámicos (horarios y tipos de servicio), listado de tarjetas informativas de buses con precio, placa y asientos disponibles.
* **Reglas de Negocio:** Paginación de resultados y actualización en tiempo real mediante requests dinámicos hacia la API Core.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla del listado de salidas encontradas, con el sidebar de filtros por bloques horarios aplicados.*
> `![Pantalla de Listado y Filtros de Viajes](/docs/images/screens/cliente-listado-viajes.png)`

---

### 2.3 Pantalla de Mapa de Asientos Dinámico
* **Descripción:** Panel interactivo que reproduce en 2D la distribución física exacta del bus asignado al itinerario.
* **Componentes Clave:** Selector de pisos (en buses de doble altura), leyenda de colores de estados de asientos (Disponible, Ocupado, Reservado Temporalmente y Seleccionado) y cronómetro de cuenta regresiva.
* **Reglas de Negocio:** La selección de un asiento verde dispara una solicitud de pre-reserva por 10 minutos (bloqueo temporal en base de datos).

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla de la grilla interactiva de asientos del bus, mostrando un asiento en estado seleccionado (azul) y el cronómetro de cuenta regresiva activo.*
> `![Mapa Dinámico de Asientos](/docs/images/screens/cliente-mapa-asientos.png)`

---

### 2.4 Pantalla de Formulario de Datos del Pasajero
* **Descripción:** Formulario requerido para registrar la identidad de las personas que ocuparán cada asiento seleccionado.
* **Componentes Clave:** Inputs validados para DNI/Pasaporte, nombres y fecha de nacimiento, integrados con autocompletado inteligente si el documento ya existe.
* **Reglas de Negocio:** Mensajes de error personalizados en español controlados mediante React Hook Form y Zod.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla del formulario de pasajeros mostrando las validaciones de campos obligatorios en color rojo ante ingresos erróneos.*
> `![Formulario de Registro de Pasajeros](/docs/images/screens/cliente-formulario-pasajeros.png)`

---

### 2.5 Pantalla de Checkout y Confirmación de Compra
* **Descripción:** Pantalla final de transacción comercial para consolidar el pago del pasaje.
* **Componentes Clave:** Resumen completo del itinerario (fecha, hora, asientos y precio final), selector de métodos de pago y pasarela integrada.
* **Reglas de Negocio:** Al confirmarse, el microservicio `api-sales` procesa el pago, guarda el registro de venta y emite un evento Pub/Sub en Redis para cambiar permanentemente el estado del asiento a "Ocupado".

> **📷 Evidencia Visual Requerida:**
> *Captura de la pantalla de checkout final con el desglose del costo total y el botón de confirmar pago activo.*
> `![Resumen de Compra y Checkout](/docs/images/screens/cliente-checkout-pago.png)`

---

### 2.6 Pantalla del Perfil del Cliente e Historial de Viajes
* **Descripción:** Área privada del usuario para monitorear su historial con la empresa.
* **Componentes Clave:** Historial de compras, módulo de descarga de boletos PDF y visualizador del saldo del programa de fidelización.
* **Reglas de Negocio:** Requiere autenticación de usuario previa. Los datos son consumidos desde `api-sales`.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla del área de usuario con la lista de pasajes anteriormente adquiridos e histórico de viajes completados.*
> `![Perfil de Cliente e Historial de Compras](/docs/images/screens/cliente-perfil-compras.png)`

---

### 2.7 Pantalla de Calificaciones y Reseñas de Viajes
* **Descripción:** Interfaz habilitada exclusivamente para pasajes que ya se encuentran en estado de viaje "Completado".
* **Componentes Clave:** Selector de calificación mediante estrellas (1 a 5) y caja de texto para opiniones del servicio.
* **Reglas de Negocio:** Solo se permite una reseña por pasaje adquirido.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla del modal de calificaciones que se abre desde el perfil del cliente para puntuar un viaje realizado.*
> `![Modal de Envío de Reseñas](/docs/images/screens/cliente-calificacion-viaje.png)`

---

## 3. Panel de Control Administrativo (Módulo `dashboard/` - React + Vite)

Interfaces de uso exclusivo para el equipo de operaciones y gerencia, protegidas mediante seguridad basada en roles (RBAC).

### 3.1 Pantalla Principal del Dashboard (Analíticas)
* **Descripción:** Panel de control de bienvenida con las métricas consolidadas del negocio en tiempo real.
* **Componentes Clave:** Tarjetas con indicadores clave (Ingresos totales, pasajes vendidos hoy, buses en ruta) y gráficos interactivos de barras/líneas.
* **Reglas de Negocio:** Agrupaciones y consultas eficientes hacia las bases de datos de ventas de forma segmentada.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla del Dashboard principal mostrando los gráficos de ingresos y KPI de rendimiento del día.*
> `![Métricas y Analíticas del Dashboard](/docs/images/screens/admin-dashboard-analytics.png)`

---

### 3.2 Pantalla de Gestión de Agencias y Sucursales
* **Descripción:** Administrador de los puntos físicos de origen/destino habilitados.
* **Componentes Clave:** Tabla con búsqueda/paginación, columna de estados (Activo/Inactivo) y formulario lateral de agregar/editar.
* **Reglas de Negocio:** Desactivar una agencia bloquea automáticamente la posibilidad de crear salidas vinculadas a esta ubicación.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla de la sección de agencias, mostrando la tabla de sucursales activas en el país.*
> `![Gestión de Agencias en el Panel](/docs/images/screens/admin-agencias.png)`

---

### 3.3 Pantalla de Gestión de Flota de Buses
* **Descripción:** Interfaz para el registro técnico de las unidades de transporte.
* **Componentes Clave:** Formulario de registro de especificaciones del vehículo (Placa, Marca, Modelo) y tabla de unidades asignadas.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla con la tabla de flota de buses registrados detallando placas y modelos.*
> `![Listado de Flota de Buses](/docs/images/screens/admin-flota-buses.png)`

---

### 3.4 Pantalla de Diseñador Visual de Asientos
* **Descripción:** Creador interactivo de diagramas físicos de asientos para los buses.
* **Componentes Clave:** Grilla visual donde el administrador dibuja la distribución marcando pasillos, baños, asientos estándar y VIP por piso.
* **Reglas de Negocio:** Guarda la configuración en formato de matriz relacional de asientos y pisos en la base de datos de Core.

> **📷 Evidencia Visual Requerida:**
> *Captura de pantalla del diseñador de distribución física del bus editando los espacios de escaleras, baños y asientos.*
> `![Diseñador de Distribución de Buses](/docs/images/screens/admin-disenador-asientos.png)`

---

### 3.5 Pantalla de Creación y Programación de Itinerarios
* **Descripción:** Panel para programar las salidas comerciales de los buses.
* **Componentes Clave:** Selector de ruta base, asignación de fecha/hora, selector de unidad de bus y conductor disponible.
* **Reglas de Negocio:** El sistema valida de forma automática que ni el bus ni el conductor estén asignados a otra ruta en horarios simultáneos o solapados.

> **📷 Evidencia Visual Requerida:**
> *Captura del formulario de programación de salidas con los campos de asignación de vehículo e itinerario.*
> `![Programación de Salidas de Itinerarios](/docs/images/screens/admin-programacion-salidas.png)`

---

### 3.6 Pantalla de Visualización de Ventas y Reservas Activas
* **Descripción:** Módulo de monitoreo transaccional en vivo.
* **Componentes Clave:** Buscador de transacciones por DNI de pasajero, número de reserva, fecha del viaje y estado del pago.
* **Reglas de Negocio:** Capacidad para liberar asientos en reservas anuladas manualmente por administración.

> **📷 Evidencia Visual Requerida:**
> *Captura del listado de transacciones y pasajes emitidos en el sistema de ventas.*
> `![Lista de Reservas y Ventas Activas](/docs/images/screens/admin-ventas-reservas.png)`

---

## 4. Módulo de Inteligencia Artificial (Módulo `ia/` - FastAPI)

Evidencias de la integración del asistente inteligente conversacional con OpenAI y Chatwoot CRM.

### 4.1 Pantalla del Asistente en el Portal del Cliente (Chat en Vivo)
* **Descripción:** Ventana de chat flotante integrada en la web pública para atención al usuario.
* **Componentes Clave:** Ventana conversacional limpia, respuestas automatizadas de horarios y estados de viaje con datos en tiempo real.
* **Reglas de Negocio:** Lectura dinámica de la base de datos para responder de forma precisa en lenguaje natural.

> **📷 Evidencia Visual Requerida:**
> *Captura del chat conversacional en vivo mostrando un flujo completo de consulta de itinerario y respuesta automática del bot.*
> `![Interfaz de Chat con Asistente de IA](/docs/images/screens/cliente-chat-ia.png)`

---

### 4.2 Pantalla de Gestión de Conversaciones en Chatwoot (Bandeja de Entrada de Agente)
* **Descripción:** Consola centralizada de soporte para los operadores humanos de la empresa.
* **Componentes Clave:** Bandeja de mensajes, logs de interacción del bot de IA, controles para asumir manualmente la conversación (derivación).
* **Reglas de Negocio:** Desconexión automática de la IA cuando un agente humano asignado interviene en el chat.

> **📷 Evidencia Visual Requerida:**
> *Captura de la bandeja de entrada de Chatwoot mostrando la conversación gestionada inicialmente por la IA y su posterior derivación a un operador.*
> `![Bandeja de Entrada de Chatwoot CRM](/docs/images/screens/chatwoot-consola-agente.png)`
