# Guía de Instalación y Despliegue Profesional - Sistema Entrafesa

Esta guía técnica proporciona el procedimiento detallado para la puesta en producción y configuración de la infraestructura del ecosistema **Entrafesa**. El sistema implementa una arquitectura híbrida optimizada para alto rendimiento, seguridad y escalabilidad:

1. **Frontends (Capas de Presentación):** Desplegados en **Vercel** para maximizar la velocidad de entrega a nivel global (Edge Network), optimización automática de imágenes y enrutamiento inteligente.
2. **Backends y Base de Datos (Capas de Negocio y Persistencia):** Desplegados en contenedores **Docker** administrados a través de **Easypanel** en un servidor VPS dedicado.

---

## 🏗️ 1. Arquitectura de Red e Infraestructura

El siguiente diagrama detalla cómo interactúan los componentes en producción a través de conexiones seguras HTTPS y redes internas aisladas de Docker:

```mermaid
graph TD
    subgraph Vercel ["Red de Vercel (Edge CDN)"]
        UI["Web Pública (ui)<br>Next.js"]
        Dash["Dashboard Admin (dashboard)<br>React + Vite"]
    end

    subgraph VPS ["Servidor VPS (Easypanel + Docker)"]
        subgraph InternalNetwork ["Red Privada Virtual de Docker"]
            CoreAPI["Core API (api)<br>NestJS / Puerto 5000"]
            SalesAPI["Sales API (api-sales)<br>NestJS / Puerto 5001"]
            IAService["Servicio de IA (ia)<br>FastAPI / Puerto 8000"]
            MSSQL[("Microsoft SQL Server<br>Puerto 1433")]
            Redis[("Redis Broker & Cache<br>Puerto 6379")]
            Chatwoot["Chatwoot CRM<br>Puerto 8080"]
        end
    end

    %% Solicitudes de Clientes
    UI -->|HTTPS: api.midominio.com| CoreAPI
    UI -->|HTTPS: sales.midominio.com| SalesAPI
    Dash -->|HTTPS: api.midominio.com| CoreAPI

    %% Persistencia y Eventos
    CoreAPI -->|Conexión MSSQL| MSSQL
    SalesAPI -->|Conexión MSSQL| MSSQL
    CoreAPI <-->|Pub/Sub & Cache| Redis
    SalesAPI <-->|Pub/Sub & Cache| Redis
    IAService <-->|Historial & TTL| Redis

    %% Automatización
    IAService -->|HTTP / Consulta de Buses| CoreAPI
    IAService <-->|Webhook & API| Chatwoot
    IAService <-->|Consultas de Textos| OpenAI["API de OpenAI (GPT-4)"]
```

---

## ⚡ 2. Despliegue de los Frontends en Vercel

Los componentes de la interfaz de usuario se encuentran en el monorepo y se configuran de manera independiente en Vercel conectándose a tu repositorio de control de versiones.

### 2.1 Web Pública (`ui/` - Next.js)

1. Inicia sesión en tu consola de Vercel y haz clic en **Add New** > **Project**.
2. Importa el repositorio del proyecto y define los siguientes campos:
   * **Framework Preset:** `Next.js`
   * **Root Directory:** Selecciona la carpeta `ui`.
3. Expande **Build and Output Settings**:
   * **Build Command:** `pnpm --filter=@transporte/ui build`
   * **Output Directory:** `.next`
4. En la sección **Environment Variables**, configure las siguientes variables de entorno requeridas para la compilación:
   * `NEXT_PUBLIC_API_URL`: URL pública de producción del Core API (ej. `https://api.tu-dominio.com`).
   * `NEXT_PUBLIC_SALES_API_URL`: URL pública de producción de la API de Ventas (ej. `https://sales.tu-dominio.com`).

> **📷 Captura Recomendada:**
> *Colocar aquí una captura de pantalla de la interfaz de configuración del proyecto en Vercel, mostrando el campo 'Root Directory' y el listado de 'Environment Variables'.*
> `![Configuración del Proyecto Next.js en Vercel](/docs/images/vercel-config-ui.png)`

---

### 2.2 Dashboard de Administración (`dashboard/` - React + Vite)

1. En la consola de Vercel, crea otro proyecto importando el mismo repositorio.
2. Define los siguientes parámetros:
   * **Framework Preset:** `Vite`
   * **Root Directory:** Selecciona la carpeta `dashboard`.
3. En **Build and Output Settings**:
   * **Build Command:** `pnpm --filter=@transporte/dashboard build`
   * **Output Directory:** `dist`
4. Agrega las siguientes variables en **Environment Variables**:
   * `VITE_API_URL`: URL pública de producción de la API Core (ej. `https://api.tu-dominio.com`).

> **⚠️ Importante para SPAs (Single Page Applications):**
> Vercel requiere procesar correctamente las rutas del lado del cliente. Asegúrate de verificar que el archivo `vercel.json` se encuentra en la raíz del subdirectorio `/dashboard`.

---

## 🐳 3. Despliegue del Backend y Servicios en Easypanel

Easypanel simplifica la administración de contenedores Docker mediante una interfaz visual intuitiva, manejando el aprovisionamiento de bases de datos, redes internas, certificados SSL automáticos con Let's Encrypt y despliegue continuo desde ramas de Git.

### 3.1 Aprovisionamiento de Servicios Auxiliares (Bases de Datos y Caché)

Antes de levantar las APIs, debes crear los servicios que contienen la persistencia de datos.

#### A. Base de Datos: Microsoft SQL Server (MSSQL)
1. En tu proyecto de Easypanel, dirígete a **Databases** y selecciona **Microsoft SQL Server**.
2. Configura las siguientes variables obligatorias:
   * `MSSQL_SA_PASSWORD`: Una contraseña fuerte para el administrador principal `sa`.
   * `ACCEPT_EULA`: `Y`
3. Conéctate a la base de datos usando una herramienta como DBeaver o Azure Data Studio a través del puerto público asignado temporalmente, y ejecuta los comandos para crear las bases de datos segregadas:
   ```sql
   CREATE DATABASE EntrafesaCore;
   CREATE DATABASE EntrafesaSales;
   ```

> **📷 Captura Recomendada:**
> *Colocar aquí una captura del contenedor de MSSQL creado dentro del panel de control de Easypanel con sus variables de entorno configuradas.*
> `![Servicio MSSQL en Easypanel](/docs/images/easypanel-mssql.png)`

#### B. Broker de Eventos y Caché: Redis
1. En el menú de **Databases**, selecciona **Redis**.
2. Easypanel asignará una dirección de red interna y contraseña de manera automática. Anota el Host Interno asignado (generalmente `redis` o `srv-captain--redis`).

---

### 3.2 Despliegue de Aplicaciones Personalizadas (Custom Apps)

Cada una de nuestras aplicaciones de backend cuenta con su respectivo `Dockerfile` ubicado en su respectiva carpeta. Configúralas en Easypanel siguiendo estas instrucciones:

#### A. Core API (`api/` - NestJS)
1. En tu proyecto de Easypanel, crea una nueva **App** de tipo **Git Repository**.
2. Vincula tu repositorio de GitHub y especifica:
   * **Branch:** `main` (o tu rama de producción).
   * **Dockerfile Path:** `api/Dockerfile`
3. Configura las variables de entorno en la sección **Env**:
   * `PORT`: `5000`
   * `DATABASE_URL`: `sqlserver://sa:PASSWORD@srv-captain--mssql:1433/EntrafesaCore?encrypt=true&trustServerCertificate=true` *(Sustituye por la dirección interna del servicio de MSSQL de Easypanel)*.
   * `JWT_SECRET`: Una clave simétrica de alta seguridad para la firma de tokens JWT.
   * `REDIS_HOST`: Host interno del contenedor de Redis (`srv-captain--redis`).
   * `REDIS_PORT`: `6379`

> **📷 Captura Recomendada:**
> *Colocar aquí una captura de pantalla del despliegue exitoso del Core API en la consola de logs de Easypanel.*
> `![Logs de Despliegue Core API](/docs/images/easypanel-deploy-core.png)`

---

#### B. Sales API (`api-sales/` - NestJS)
1. Crea una nueva **App** vinculando el repositorio y define:
   * **Dockerfile Path:** `api-sales/Dockerfile`
2. Configura las variables de entorno en la sección **Env**:
   * `PORT`: `5001`
   * `DATABASE_URL`: `sqlserver://sa:PASSWORD@srv-captain--mssql:1433/EntrafesaSales?encrypt=true&trustServerCertificate=true`
   * `REDIS_HOST`: Host interno del contenedor de Redis.
   * `REDIS_PORT`: `6379`

---

#### C. Servicio de Inteligencia Artificial (`ia/` - FastAPI + Python)
1. Crea una nueva **App** de repositorio Git y configura:
   * **Dockerfile Path:** `ia/Dockerfile`
2. Configura las variables de entorno en la sección **Env**:
   * `PORT`: `8000`
   * `OPENAI_API_KEY`: Tu API Key secreta provista por OpenAI.
   * `CHATWOOT_URL`: URL de producción de la consola de Chatwoot.
   * `CHATWOOT_API_TOKEN`: Access Token del agente administrativo de Chatwoot.
   * `MAIN_API_URL`: Endpoint de red interna de la API Core (ej. `http://srv-captain--core-api:5000`).
   * `REDIS_HOST`: Host interno del contenedor de Redis.
   * `REDIS_PORT`: `6379`

---

## 🔒 4. Conectividad Segura y Dominios

1. **Redes Aisladas:** Todos los contenedores deben residir en el mismo proyecto dentro de Easypanel para compartir la red por defecto creada por Docker. De esta forma, las credenciales e hilos de comunicación de bases de datos y Redis no viajan por la red pública.
2. **Puertos Expuestos:** Solo los puertos de los servicios web deben mapearse externamente (Easypanel asigna esto automáticamente al agregar dominios en la pestaña **Domains** de cada aplicación).
   * **Core API:** Vincular al dominio `api.tu-dominio.com` (Redirecciona internamente al puerto `5000`).
   * **Sales API:** Vincular al dominio `sales.tu-dominio.com` (Redirecciona internamente al puerto `5001`).
   * **Servicio IA:** Vincular al dominio `ia.tu-dominio.com` (Redirecciona internamente al puerto `8000`).

> **📷 Captura Recomendada:**
> *Colocar aquí una captura de la sección de dominios (Domains) de una aplicación en Easypanel mostrando el certificado SSL activo.*
> `![Configuración de Dominio con SSL en Easypanel](/docs/images/easypanel-domain-ssl.png)`
