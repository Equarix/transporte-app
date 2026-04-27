# Aprendizaje del Equipo

Este documento resume los conocimientos, herramientas y habilidades desarrolladas por el equipo durante el diseño e implementación de la arquitectura del sistema Entrafesa.

| Aspecto Aprendido | Comentario del Equipo |
| :--- | :--- |
| **Arquitectura de Microservicios con Redis** | El uso de Redis como broker de mensajería nos permitió desacoplar el módulo de ventas, facilitando un procesamiento asíncrono y una mayor resiliencia ante picos de carga. |
| **Gestión de Monorepos (TurboRepo/pnpm)** | Aprendimos a centralizar la lógica común en paquetes compartidos (como `dtos`). Esto redujo drásticamente los errores de comunicación entre el frontend y el backend al compartir contratos de datos exactos. |
| **Estructura Modular con NestJS** | La adopción de NestJS nos ayudó a mantener un código altamente organizado y escalable gracias a su sistema de Inyección de Dependencias y el uso de decoradores para lógica transversal. |
| **Segregación de Bases de Datos** | Entendimos la importancia de separar las bases de datos operativa y de ventas. Aunque añade complejidad en la sincronización, la mejora en el rendimiento y la independencia de fallos es significativa. |
| **Optimización con React Query** | El manejo del estado del servidor en el frontend cambió radicalmente. React Query simplificó la lógica de carga, caché y sincronización de datos, mejorando la experiencia del usuario final. |
| **Seguridad con JWT y RBAC** | Profundizamos en la implementación de autenticación stateless y control de acceso basado en roles, asegurando que cada endpoint esté protegido de manera declarativa y robusta. |
| **Desarrollo Full-stack TypeScript** | Experimentamos el poder de tener un único lenguaje en todo el stack. Esto aceleró la velocidad de desarrollo y facilitó que los desarrolladores pudieran colaborar en cualquier parte del monorepo. |
| **Configuración de TypeORM con MSSQL** | Aprendimos a optimizar las consultas y migraciones para Microsoft SQL Server, manejando tipos de datos específicos y relaciones complejas de manera programática. |
