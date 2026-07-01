# Manual de Usuario - Sistema Entrafesa

Este documento constituye la guía oficial del usuario para la interacción con las diferentes plataformas del ecosistema Entrafesa. El manual se divide en tres secciones principales: el portal del cliente (interfaz orientada a la venta y autogestión), el panel de control administrativo (interfaz de operaciones y monitoreo) y el asistente de inteligencia artificial (canal automatizado de atención y soporte).

---

## 1. Portal Público del Cliente (Venta y Autogestión)

La interfaz del cliente ha sido diseñada bajo principios de usabilidad responsiva, permitiendo una experiencia óptima tanto en dispositivos móviles como en computadoras de escritorio. A través de este portal, el usuario puede buscar viajes, seleccionar asientos, realizar compras y gestionar sus datos de fidelidad.

### 1.1 Módulo de Búsqueda y Filtros de Itinerarios
El proceso de compra comienza en la pantalla de inicio con la consulta de itinerarios disponibles.

1.  **Ingreso de Ubicaciones:** El usuario debe interactuar con los campos desplegables "Origen" y "Destino". El sistema autocompletará las ciudades en las cuales Entrafesa posee agencias activas autorizadas para embarque y desembarque.
2.  **Selección de Fecha:** Mediante un calendario visual con validación de fechas (se bloquean las fechas anteriores a la fecha actual del sistema), el usuario debe fijar el día de su viaje. Opcionalmente, se puede definir una fecha de retorno si se trata de un viaje de ida y vuelta.
3.  **Ejecución de la Consulta:** Al hacer clic en el botón "Buscar Viajes", se realiza una petición síncrona al servicio Core para extraer las rutas programadas que cumplan estrictamente con los criterios indicados.
4.  **Visualización y Filtrado de Resultados:**
    *   **Filtros Horarios:** El usuario puede acotar los resultados según bloques horarios: Mañana (06:00 a 12:00), Tarde (12:00 a 18:00) o Noche (18:00 a 06:00).
    *   **Filtros de Servicio:** Permite clasificar las unidades entre Servicio Regular (buses estándar de un piso) o Servicio Ejecutivo/VIP (buses de dos pisos con asientos reclinables de mayor comodidad en el primer nivel).
    *   **Tarjeta de Itinerario:** Cada opción en la lista detalla con precisión la hora exacta de salida, el tiempo estimado de viaje en horas, la placa de la unidad de bus, los asientos todavía disponibles en tiempo real y el precio en moneda local.

> **📷 Captura Recomendada:**
> *Colocar aquí una captura de pantalla del Portal de Búsqueda del Cliente mostrando el formulario de origen/destino, el selector de fechas y el listado resultante de itinerarios con sus respectivos filtros.*
> `![Portal de Búsqueda de Itinerarios](/docs/images/cliente-busqueda-itinerarios.png)`

---

### 1.2 Mapa de Asientos Dinámico y Pre-reserva
Una vez seleccionado el itinerario, la pantalla cambia al módulo interactivo del bus, el cual lee la distribución directamente de la base de datos a través de la entidad lógica del bus asociado.

1.  **Alternancia de Niveles (Pisos):** En buses de dos pisos, el usuario verá dos pestañas claramente identificadas como "Primer Piso" y "Segundo Piso". El mapa cambiará de forma instantánea al hacer clic en cada una.
2.  **Leyenda de Estados Visuales:**
    *   **Asiento Disponible (Color Verde):** Representa un asiento libre. Puede ser cliqueado para agregarse a la selección del viaje.
    *   **Asiento Ocupado (Color Gris):** Asientos que ya han sido pagados y emitidos. Están deshabilitados para cualquier tipo de selección.
    *   **Asiento Reservado Temporalmente (Color Amarillo):** Asientos seleccionados por otros usuarios que se encuentran en medio de su flujo de compra. Se mantienen bloqueados durante 10 minutos.
    *   **Asiento Seleccionado por el Usuario Actual (Color Azul):** Indica los asientos elegidos por el usuario en la sesión vigente.
3.  **Proceso de Reserva Temporal:** Al seleccionar uno o más asientos verdes, el sistema se comunica con el endpoint `/reserver` de la API Core para crear una reserva temporal. Un cronómetro en pantalla iniciará una cuenta regresiva de 10:00 minutos. Si el usuario no completa la transacción en ese lapso, la reserva se elimina automáticamente en base de datos y los asientos regresan a color verde para estar disponibles para otros clientes.

> **📷 Captura Recomendada:**
> *Colocar aquí una captura de pantalla del mapa dinámico de selección de asientos mostrando la distribución de butacas, el selector de niveles (pisos) y el contador de tiempo de reserva temporal.*
> `![Mapa Interactivo de Asientos](/docs/images/cliente-seleccion-asientos.png)`

---

### 1.3 Formulario de Datos del Pasajero y Checkout de Pago
Una vez seleccionados los asientos, el sistema solicita los datos de los pasajeros que ocuparán cada butaca elegida.

1.  **Ingreso de Datos de Pasajeros:**
    *   Para cada asiento se debe detallar el tipo de documento (DNI, Pasaporte, Carnet de Extranjería), el número de documento, el nombre completo y la fecha de nacimiento.
    *   El sistema cuenta con autocompletado inteligente: si el DNI del pasajero coincide con un usuario previamente registrado, los campos de nombre se rellenarán de manera automática.
2.  **Validaciones de Formulario:** Todos los campos están regulados por un esquema estricto de Zod en español. Si un campo no cumple con el formato (por ejemplo, un DNI con caracteres no numéricos o menor de 8 dígitos), se mostrará un mensaje de error en color rojo debajo del input correspondiente impidiendo avanzar al checkout.
3.  **Método de Pago:** El usuario selecciona el método de pago de su preferencia (tarjeta de crédito/débito, transferencia bancaria o monederos digitales).
4.  **Confirmación y Emisión de Comprobante:** Al confirmar la compra, el microservicio `api-sales` valida la vigencia de la pre-reserva temporal, procesa la transacción, escribe en la base de datos de ventas, emite un mensaje en Redis para bloquear definitivamente el asiento y genera el boleto electrónico en formato PDF descargable, el cual se envía adicionalmente al correo electrónico provisto.

> **📷 Captura Recomendada:**
> *Colocar aquí una captura de pantalla del formulario de checkout con los campos de datos del pasajero rellenos, mensajes de validación de error activos y la pasarela de pago seleccionada.*
> `![Formulario de Pasajero y Pasarela de Pago](/docs/images/cliente-checkout.png)`

---

### 1.4 Módulo de Fidelidad y Calificaciones en el Perfil de Usuario
Los pasajeros registrados cuentan con un panel privado de autogestión de su cuenta.

1.  **Historial de Compras:** Una lista detallada de todos los pasajes adquiridos históricamente. Permite descargar comprobantes anteriores y verificar el estado de viajes futuros.
2.  **Acumulación de Puntos (Programa de Fidelización):**
    *   El perfil muestra el saldo neto de puntos acumulados.
    *   Cada viaje realizado suma puntos en base a la distancia de la ruta y el costo total pagado del pasaje.
    *   Los puntos acumulados se actualizan automáticamente tras la emisión del viaje confirmada por `api-sales`.
3.  **Sistema de Reseñas:**
    *   Una vez que el viaje ha finalizado y el estado de la reserva pasa a "Completado", se habilita en el perfil del usuario un botón para emitir una reseña.
    *   El usuario puede otorgar una valoración mediante una escala de 1 a 5 estrellas y escribir un comentario cualitativo sobre su experiencia (limpieza, puntualidad, trato del conductor).

> **📷 Captura Recomendada:**
> *Colocar aquí una captura del panel del perfil del cliente mostrando la visualización de los puntos acumulados, el historial de viajes y el modal de calificación por estrellas.*
> `![Panel de Fidelidad y Calificaciones](/docs/images/cliente-perfil-fidelidad.png)`

---

## 2. Panel de Control Administrativo (Dashboard)

El panel administrativo permite a la gerencia y al equipo de operaciones administrar de manera centralizada la infraestructura lógica y física de Entrafesa.

### 2.1 Módulo de Gestión de Agencias y Oficinas
Este módulo administra las locaciones donde opera la compañía.

1.  **Registro de Nueva Agencia:** El administrador debe ingresar al subformulario de agencias y presionar "Agregar Agencia". Los campos requeridos son: Nombre de la Agencia (ej. "Agencia Central Trujillo"), Dirección Exacta, Ciudad, Teléfono de Contacto y Estado (Activo/Inactivo).
2.  **Edición e Inactivación:** Si una agencia entra en mantenimiento o cierra temporalmente, su estado puede cambiarse a "Inactiva". Esto causará de inmediato que ningún usuario pueda programar u ofertar viajes con salida o llegada en dicha locación.

> **📷 Captura Recomendada:**
> *Colocar aquí una captura de pantalla del listado de agencias del panel de administración con sus estados activo/inactivo.*
> `![Módulo de Gestión de Agencias](/docs/images/admin-gestion-agencias.png)`

---

### 2.2 Registro de Flota y Diseñador Visual de Buses
La configuración de buses es un proceso crucial que alimenta el mapa interactivo del cliente.

1.  **Alta de Unidades de Bus:** Se requiere ingresar la Placa del Vehículo (única en el sistema), la Marca, el Modelo, la Capacidad Máxima de Pasajeros y la cantidad de pisos (1 o 2 niveles).
2.  **Configuración de Asientos:**
    *   El administrador cuenta con una interfaz de grilla interactiva donde define cuántas filas y columnas componen el interior del bus.
    *   Se deben marcar los cuadrantes de la grilla que representan pasillos, escaleras o baños para que no sean interpretados como asientos en el frontend público.
    *   A cada asiento útil en la grilla se le asigna un número de butaca único y se categoriza su tipo: Estándar o VIP.

> **📷 Captura Recomendada:**
> *Colocar aquí una captura del Diseñador Visual de Buses, mostrando la grilla de distribución de asientos, pasillos, baños y niveles.*
> `![Diseñador Visual de Distribución de Buses](/docs/images/admin-diseñador-buses.png)`

---

### 2.3 Creación y Programación de Rutas e Itinerarios
Conecta la infraestructura física con la oferta comercial.

1.  **Creación de Rutas Bases:** Define trayectos estables entre dos agencias (ej. "Trujillo a Chiclayo"). Se configura la distancia total en kilómetros y el tiempo promedio estimado de viaje.
2.  **Programación de Salidas (Itinerarios Específicos):**
    *   **Asignación de Ruta:** Se selecciona una ruta base previamente configurada.
    *   **Horario de Salida:** Se especifica el día y hora exacta en que iniciará el viaje.
    *   **Asignación de Unidad:** Se asocia un bus específico de la flota que se encuentre en estado "Disponible" (no asignado a otro viaje en horarios colindantes).
    *   **Asignación de Conductor:** Se vincula a un chofer de la base de datos que cuente con su licencia de conducir vigente.
    *   **Configuración de Precios:** Se define el precio base para los asientos estándar y el precio base para los asientos VIP de esa salida en específico.

> **📷 Captura Recomendada:**
> *Colocar aquí una captura del formulario de programación de salidas o el calendario mensual de itinerarios del dashboard.*
> `![Programación y Creación de Itinerarios](/docs/images/admin-programacion-itinerarios.png)`

---

### 2.4 Panel de Control de Ventas, Reservas y Reportes Estadísticos
Permite la toma de decisiones basada en datos reales de negocio.

1.  **Visualizador de Reservas Activas:** Lista en tiempo real de todas las transacciones generadas en el sistema. Los agentes pueden realizar búsquedas por DNI de pasajero, número de reserva o placa de bus.
2.  **Reportes y Exportación de Datos:**
    *   **Reportes de Ocupación:** Gráficos que muestran las rutas más transitadas y las horas con mayor demanda.
    *   **Reportes de Ingresos:** Filtro dinámico por rango de fechas para revisar las ventas de pasajes consolidadas.
    *   **Descargas:** Toda la información de los reportes se puede exportar en formato de hojas de cálculo CSV o archivos PDF listos para impresión o auditoría interna.

> **📷 Captura Recomendada:**
> *Colocar aquí una captura de la sección de estadísticas y gráficos del panel de administración (Dashboard principal de analítica).*
> `![Panel de Reportes y Estadísticas de Ventas](/docs/images/admin-reportes-analitica.png)`

---

## 3. Asistente Conversacional Inteligente (IA)

El asistente de inteligencia artificial opera integrado en el chat en vivo del sitio web oficial y en los canales de mensajería vinculados a Chatwoot. Funciona de manera autónoma las 24 horas del día.

### 3.1 Consultas de Viajes y Disponibilidad en Lenguaje Natural
El bot interactúa interpretando el lenguaje natural del usuario para simplificar el proceso de cotización.

*   **Ejemplo de Consulta:** El usuario escribe: "Hola, necesito viajar de Trujillo a Chiclayo este fin de semana por la tarde, ¿qué buses tienen?".
*   **Procesamiento:** El módulo de IA extrae el origen ("Trujillo"), el destino ("Chiclayo"), la fecha ("este fin de semana") y el rango horario ("por la tarde").
*   **Respuesta del Asistente:** El bot realiza la consulta en la base de datos de manera interna y devuelve una respuesta estructurada libre de códigos complejos:
    ```text
    Hola. Para este sábado 4 de julio, disponemos de las siguientes salidas por la tarde:
    1. Salida a las 14:00 horas - Bus Ejecutivo (Placa T5A-982) - Precio: 45.00 Soles.
    2. Salida a las 16:30 horas - Bus Regular (Placa B2U-104) - Precio: 35.00 Soles.
    
    ¿Deseas que te ayude a iniciar el proceso de reserva para alguno de estos horarios?
    ```

> **📷 Captura Recomendada:**
> *Colocar aquí una captura del chat interactivo del cliente conversando con el bot de IA cotizando un pasaje.*
> `![Chat Conversacional de Cotización IA](/docs/images/chat-ia-disponibilidad.png)`

---

### 3.2 Seguimiento en Tiempo Real del Estado del Viaje (Tracking)
Los usuarios pueden informarse sobre las unidades en ruta de forma rápida.

*   **Ejemplo de Consulta:** "Quiero saber por dónde viene el bus de mi familiar que viaja desde Lima, la placa es XYZ-789".
*   **Procesamiento:** El bot valida la existencia de la placa en viajes activos programados para el día actual.
*   **Respuesta del Asistente:**
    ```text
    El bus con placa XYZ-789 inició su recorrido desde la Agencia de Lima con destino a Trujillo a las 08:00 horas.
    Actualmente el viaje se encuentra en curso sin retrasos reportados. 
    La hora estimada de llegada a la Agencia de Trujillo es a las 17:00 horas.
    ```

> **📷 Captura Recomendada:**
> *Colocar aquí una captura del chat interactivo del cliente consultando el estado de un bus en tiempo real.*
> `![Seguimiento en Tiempo Real](/docs/images/chat-ia-tracking.png)`

---

### 3.3 Gestión Automática de Quejas, Sugerencias y Derivación a Agentes
El asistente proporciona un canal directo de atención que optimiza el trabajo de soporte humano.

1.  **Captura de Incidentes:** Si un cliente expresa una queja (ej. "Mi asiento estaba en mal estado" o "El bus salió tarde"), el bot solicita formalmente el número del boleto y el DNI para realizar la búsqueda en la base de datos transaccional de ventas.
2.  **Documentación del Caso:** El bot estructurará la queja asociándola al registro de compra del cliente en base de datos.
3.  **Escalación Inteligente:** Si la solicitud no puede resolverse de forma automática con las respuestas parametrizadas del sistema, el bot desactiva la interacción automática en ese chat y transfiere la conversación a la bandeja de entrada de agentes humanos de Chatwoot. El personal de atención al cliente recibirá una notificación en su panel de administración para tomar el control de la conversación y dar soporte personalizado.

> **📷 Captura Recomendada:**
> *Colocar aquí una captura del panel de Chatwoot CRM mostrando una conversación escalada del bot de IA a un agente de atención humano.*
> `![Derivación a Agente Humano en Chatwoot](/docs/images/chatwoot-derivacion-agente.png)`
