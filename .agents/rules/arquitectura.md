---
trigger: always_on
---

# React Architecture Skill

## Objetivo

Mantener una arquitectura React escalable, reutilizable y modular.

## Reglas Obligatorias

### 1. Pages únicamente para rutas

La carpeta `pages/` debe contener exclusivamente componentes que representen una ruta o pantalla completa.

✅ Correcto

```text
pages/
├── DashboardPage.tsx
├── UsersPage.tsx
└── LoginPage.tsx
````

❌ Incorrecto

```text
pages/
├── UserCard.tsx
├── UserTable.tsx
└── DashboardWidget.tsx
```

Los componentes visuales, lógica reutilizable y utilidades nunca deben vivir dentro de `pages`.

---

### 2. Atomización de componentes

Siempre analizar si una parte de la UI puede reutilizarse.

Antes de crear un componente preguntarse:

* ¿Puede ser usado en más de una pantalla?
* ¿Representa una pieza visual independiente?
* ¿Puede encapsular una responsabilidad específica?

Si la respuesta es sí, extraerlo a un componente independiente.

Ejemplo:

❌ Incorrecto

```tsx
const UserPage = () => {
  return (
    <div>
      <img />
      <span />
      <button />
    </div>
  );
};
```

✅ Correcto

```tsx
const UserPage = () => {
  return (
    <UserCard>
      <UserAvatar />
      <UserInfo />
      <UserActions />
    </UserCard>
  );
};
```

---

### 3. Estructura de carpetas

Utilizar la siguiente arquitectura:

```text
src/
├── components/
│   ├── Button/
│   ├── Modal/
│   ├── Input/
│   └── Table/
│
├── hooks/
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   └── useLocalStorage.ts
│
├── modules/
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   │
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       ├── services/
│       ├── types/
│       └── pages/
│
└── pages/
```

---

### 4. Components

La carpeta:

```text
components/
```

contiene componentes globales reutilizables por toda la aplicación.

Ejemplos:

```text
Button
Modal
Input
Table
Pagination
Loader
Dialog
Avatar
```

Estos componentes no deben depender de un módulo específico.

---

### 5. Modules

Cada dominio funcional debe vivir dentro de:

```text
modules/[module-name]/
```

Ejemplo:

```text
modules/users/
modules/auth/
modules/dashboard/
modules/calendar/
modules/reports/
```

Dentro de cada módulo pueden existir:

```text
components/
hooks/
utils/
services/
types/
pages/
```

Todo lo relacionado con el módulo debe mantenerse encapsulado dentro de él.

---

### 6. Hooks reutilizables

Los hooks que puedan ser utilizados por varios módulos deben ubicarse en:

```text
hooks/
```

Ejemplos:

```text
useDebounce
usePagination
useLocalStorage
useIntersectionObserver
usePrevious
useToggle
```

---

### 7. Hooks específicos de módulo

Si un hook pertenece únicamente a un módulo debe ubicarse en:

```text
modules/[module]/hooks/
```

Ejemplo:

```text
modules/calendar/hooks/useCalendarEvents.ts
modules/users/hooks/useUsersTable.ts
```

---

### 8. Evitar duplicación

Si una implementación se repite dos veces o más:

1. Identificar el patrón.
2. Extraer componente, hook o utilidad.
3. Reutilizar la abstracción.

La duplicación de código debe minimizarse constantemente.

---

### 9. Responsabilidad única

Cada archivo debe tener una responsabilidad clara.

Ejemplos:

✅

```text
UserCard.tsx
UserAvatar.tsx
UserActions.tsx
```

❌

```text
UserEverything.tsx
```

---

### 10. Principio general

Priorizar siempre:

* Reutilización
* Modularidad
* Componentes pequeños
* Separación de responsabilidades
* Escalabilidad
* Bajo acoplamiento
* Alta cohesión

Ante cualquier duda, favorecer la extracción de componentes, hooks y utilidades reutilizables antes de aumentar la complejidad de un archivo existente.

```

Este skill fuerza una arquitectura tipo **Feature/Module Based + Atomic Components**, que suele funcionar muy bien en proyectos React medianos y grandes.
```

Puedes añadir una sección mucho más estricta sobre tipado:

# Política de Tipado Estricto

## Regla Obligatoria

Está prohibido utilizar:

- `any`
- `unknown`

Bajo ninguna circunstancia.

Esta regla aplica a:

- Componentes
- Hooks
- Servicios
- Utilidades
- Interfaces
- Tipos
- Contexts
- Providers
- Tests

---

## Incorrecto

```ts
const data: any = response.data;

const value: unknown = getValue();

function process(data: any) {}

interface ApiResponse {
  data: any;
}
````

---

## Correcto

Siempre crear tipos o interfaces específicas.

```ts
interface User {
  userId: number;
  name: string;
}

const data: User = response.data;
```

```ts
interface ApiResponse<T> {
  data: T;
  success: boolean;
}
```

```ts
function process(user: User) {}
```

---

## Datos externos

Cuando una API, librería o fuente externa devuelve un valor sin tipar:

❌ Incorrecto

```ts
const data: any = response.data;
```

❌ Incorrecto

```ts
const data: unknown = response.data;
```

✅ Correcto

Crear el contrato correspondiente.

```ts
interface GetUsersResponse {
  users: User[];
  total: number;
}

const data: GetUsersResponse = response.data;
```

---

## Genéricos

Cuando el tipo sea dinámico, utilizar genéricos.

```ts
interface ApiResponse<T> {
  data: T;
  success: boolean;
}
```

```ts
const response: ApiResponse<User[]>;
```

---

## Librerías Externas

Si una librería expone `any` o `unknown`:

1. Crear un adapter.
2. Tipar la respuesta.
3. Exponer únicamente tipos seguros al resto de la aplicación.

Ejemplo:

```ts
interface LibraryUser {
  id: number;
  name: string;
}

export function mapLibraryUser(data: LibraryUserResponse): LibraryUser {
  return {
    id: data.id,
    name: data.name,
  };
}
```

---

## Castings

Evitar:

```ts
value as any
```

```ts
value as unknown
```

```ts
<any>value
```

```ts
<unknown>value
```

Solo se permiten castings hacia tipos explícitos y justificados.

```ts
const user = response.data as User;
```

---

## Filosofía

Si no se conoce el tipo:

NO usar `any`.

NO usar `unknown`.

Se debe investigar el contrato real, modelarlo mediante interfaces o tipos y utilizar tipado explícito.

La aplicación debe poder compilar con:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

Sin excepciones.


Sin embargo, te recomiendo permitir `unknown` en casos muy concretos (integraciones externas, parsing de JSON, eventos genéricos), porque TypeScript fue diseñado precisamente para eso. Prohibir `any` tiene mucho sentido; prohibir también `unknown` hace el código más rígido y a veces obliga a usar castings menos seguros. Aun así, si quieres una regla corporativa estricta para Antigravity, el bloque anterior la deja completamente prohibida.

Puedes agregar esta sección al skill:

# Diseño de Componentes

## Minimizar la Cantidad de Props

Los componentes no deben recibir una cantidad excesiva de props.

Cuando un componente comienza a recibir muchas props, normalmente es una señal de:

- Responsabilidades mezcladas.
- Falta de composición.
- Componente demasiado grande.
- Falta de encapsulamiento.
- Mala separación de responsabilidades.

---

## Regla General

Si un componente supera aproximadamente entre 5 y 7 props, evaluar una refactorización.

Antes de agregar una nueva prop preguntarse:

1. ¿Realmente pertenece a este componente?
2. ¿Puede resolverse mediante composición?
3. ¿Puede agruparse dentro de un objeto tipado?
4. ¿El componente está haciendo demasiado?

---

## Incorrecto

```tsx
<UserCard
  name={name}
  email={email}
  phone={phone}
  address={address}
  city={city}
  country={country}
  isActive={isActive}
  role={role}
  permissions={permissions}
  avatar={avatar}
  createdAt={createdAt}
/>
````

---

## Correcto

```tsx
<UserCard user={user} />
```

o

```tsx
<UserCard>
  <UserAvatar />
  <UserInfo />
  <UserActions />
</UserCard>
```

---

## Preferir Objetos Tipados

❌

```tsx
<ProductCard
  title={title}
  price={price}
  stock={stock}
  category={category}
  image={image}
/>
```

✅

```tsx
<ProductCard product={product} />
```

---

## Preferir Composición

Cuando existan múltiples variantes de contenido:

❌

```tsx
<Modal
  title={title}
  body={body}
  footer={footer}
  headerActions={headerActions}
/>
```

✅

```tsx
<Modal>
  <ModalHeader />
  <ModalBody />
  <ModalFooter />
</Modal>
```

---

## Evitar Prop Drilling

No pasar props a través de múltiples niveles únicamente para llegar a un componente hijo.

Si ocurre:

* Evaluar Context.
* Evaluar hooks.
* Evaluar composición.
* Evaluar dividir responsabilidades.

---

## Componentes de Dominio

Los componentes de dominio deben recibir modelos de negocio completos cuando sea posible.

❌

```tsx
<UserRow
  id={user.id}
  name={user.name}
  email={user.email}
  role={user.role}
  status={user.status}
/>
```

✅

```tsx
<UserRow user={user} />
```

---

## Regla de Oro

Si un componente necesita demasiadas props para funcionar:

* Dividirlo.
* Componerlo.
* Encapsular lógica.
* Revisar responsabilidades.

Un buen componente suele ser pequeño, reutilizable y con una API simple y predecible.


También añadiría una regla adicional bastante útil para equipos grandes:

> **Prohibido el "Props Hell"**: componentes con más de 10 props deben considerarse un olor de diseño y deben refactorizarse obligatoriamente antes de aprobar un PR, salvo justificación técnica documentada. Esto evita que la API de los componentes se vuelva difícil de mantener y entender.