# Patrones de Diseño Aplicados

Este documento describe los patrones de diseño utilizados en la arquitectura de la aplicación, su propósito y su ubicación en el código.

---

## 1. Singleton (Instancia Única)
**Propósito:** Asegurar que una clase tenga una única instancia y proporcionar un punto de acceso global a ella. En NestJS, los servicios son Singletons por defecto dentro de su módulo.
**Problema que resuelve:** Evita la duplicación de recursos costosos (como conexiones a bases de datos) y permite mantener un estado compartido de manera controlada.

**Uso en el código:**
- **Archivo:** [agency.service.ts](file:///c:/Users/laszlo/Downloads/uni/admin/entrafesa/api/src/modules/agency/agency.service.ts)
- **Ejemplo:** La clase `AgencyService` se instancia una sola vez y se comparte entre todos los controladores que la necesiten.

---

## 2. Factory (Fábrica)
**Propósito:** Definir una interfaz para crear un objeto, pero dejar que las subclases decidan qué clase instanciar.
**Problema que resuelve:** Desacopla la lógica de creación de objetos del código que los utiliza, facilitando la escalabilidad y el mantenimiento.

**Uso en el código:**
- **Archivo:** [main.ts](file:///c:/Users/laszlo/Downloads/uni/admin/entrafesa/api/src/main.ts)
- **Ejemplo:** `NestFactory.create(AppModule)` se encarga de instanciar y configurar toda la aplicación NestJS.

---

## 3. Repository (Repositorio)
**Propósito:** Mediar entre las capas de dominio y de mapeo de datos, actuando como una colección de objetos en memoria.
**Problema que resuelve:** Separa la lógica de negocio de la lógica de acceso a datos (SQL, NoSQL, etc.), permitiendo cambiar la fuente de datos sin afectar el resto del sistema.

**Uso en el código:**
- **Archivo:** [agency.service.ts](file:///c:/Users/laszlo/Downloads/uni/admin/entrafesa/api/src/modules/agency/agency.service.ts)
- **Ejemplo:** El uso de `private agencyRepository: Repository<Agency>` para interactuar con la base de datos de agencias.

---

## 4. Observer / Pub-Sub (Observador)
**Propósito:** Definir una dependencia de uno a muchos entre objetos, de forma que cuando un objeto cambie su estado, todos sus dependientes sean notificados.
**Problema que resuelve:** Permite la comunicación desacoplada entre diferentes partes del sistema o microservicios.

**Uso en el código:**
- **Archivo:** [sales.controller.ts](file:///c:/Users/laszlo/Downloads/uni/admin/entrafesa/api-sales/src/modules/sales/sales.controller.ts)
- **Ejemplo:** El decorador `@MessagePattern('createSale')` actúa como un suscriptor a eventos de creación de ventas en la arquitectura de microservicios.

---

## 5. Dependency Injection (Inyección de Dependencias)
**Propósito:** Un patrón donde los objetos no crean los objetos que necesitan, sino que estos les son "inyectados" desde afuera.
**Problema que resuelve:** Facilita el testing (mediante mocks) y reduce el acoplamiento fuerte entre clases.

**Uso en el código:**
- **Archivo:** [sales.controller.ts](file:///c:/Users/laszlo/Downloads/uni/admin/entrafesa/api-sales/src/modules/sales/sales.controller.ts)
- **Ejemplo:** El constructor `constructor(private readonly salesService: SalesService) {}` recibe automáticamente la instancia del servicio necesaria.

---

## 6. Adapter (Adaptador)
**Propósito:** Permitir que interfaces incompatibles trabajen juntas. En el frontend, se usa para adaptar APIs del navegador a componentes de React.
**Problema que resuelve:** Permite reutilizar lógica de bajo nivel (como el LocalStorage) de una forma amigable para el framework de UI.

**Uso en el código:**
- **Archivo:** [useLocalStorage.ts](file:///c:/Users/laszlo/Downloads/uni/admin/entrafesa/dashboard/src/hooks/useLocalStorage.ts)
- **Ejemplo:** Este hook adapta la API de `window.localStorage` para que pueda ser usada como un estado reactivo de React.

---

## 7. Decorator (Decorador)
**Propósito:** Añadir comportamiento a objetos o clases de forma dinámica sin modificar su estructura original.
**Problema que resuelve:** Permite añadir metadatos y funcionalidades transversales (como autenticación, validación o ruteo) de forma limpia y declarativa.

**Uso en el código:**
- **Archivo:** [agency.controller.ts](file:///c:/Users/laszlo/Downloads/uni/admin/entrafesa/api/src/modules/agency/agency.controller.ts)
- **Ejemplo:** Uso de `@Controller('agency')`, `@Get()`, `@Post()`, etc., para definir el comportamiento de la clase.
