---
name: arquitectura
description: Arquitectura React modular, atomización de componentes, React Hook Form, Zod y TypeScript estricto.
version: 1.0.0
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

- Reutilización
- Modularidad
- Componentes pequeños
- Separación de responsabilidades
- Escalabilidad
- Bajo acoplamiento
- Alta cohesión

Ante cualquier duda, favorecer la extracción de componentes, hooks y utilidades reutilizables antes de aumentar la complejidad de un archivo existente.


---

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

# Formularios

## Librerías Obligatorias

Todos los formularios deben implementarse utilizando:

- React Hook Form
- Zod

Está prohibido crear formularios usando únicamente:

- useState
- onChange manuales
- validaciones ad-hoc
- validaciones inline

---

## Configuración Obligatoria

Cada formulario debe tener:

1. Schema Zod
2. Inferencia automática de tipos
3. React Hook Form
4. Resolver de Zod

Ejemplo:

```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  age: z.number().min(18),
});

type UserForm = z.infer<typeof userSchema>;

export function UserForm() {
  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 18,
    },
  });

  return <form onSubmit={form.handleSubmit(console.log)}>{/* fields */}</form>;
}
```

---

## Tipado Automático

Nunca duplicar tipos.

❌ Incorrecto

```tsx
interface UserForm {
  name: string;
  email: string;
}
```

```tsx
const schema = z.object({
  name: z.string(),
  email: z.string(),
});
```

✅ Correcto

```tsx
const schema = z.object({
  name: z.string(),
  email: z.string(),
});

type UserForm = z.infer<typeof schema>;
```

El schema Zod es la única fuente de verdad.

---

## Ubicación de Schemas

Los schemas deben ubicarse junto al dominio correspondiente.

Ejemplo:

```text
modules/
└── users/
    ├── schemas/
    │   └── user.schema.ts
    ├── components/
    ├── hooks/
    ├── services/
    └── pages/
```

---

## Componentes de Formulario Reutilizables

Los controles reutilizables deben abstraerse.

Ejemplo:

```text
components/forms/
├── FormInput
├── FormSelect
├── FormTextarea
├── FormCheckbox
├── FormDatePicker
└── FormAutocomplete
```

Todos los componentes deben integrarse con React Hook Form.

---

## Validaciones

Toda validación debe vivir en Zod.

❌ Incorrecto

```tsx
if (password.length < 8) {
  throw new Error();
}
```

❌ Incorrecto

```tsx
<input required />
```

✅ Correcto

```tsx
const schema = z.object({
  password: z.string().min(8),
});
```

---

## Transformaciones

Las transformaciones de datos deben realizarse mediante Zod.

```tsx
const schema = z.object({
  amount: z.coerce.number(),
  date: z.coerce.date(),
});
```

---

## Formularios Grandes

Si un formulario supera aproximadamente 8-10 campos:

- Dividir en secciones.
- Crear subcomponentes.
- Extraer lógica a hooks.
- Mantener una única instancia de React Hook Form.

Ejemplo:

```text
UserForm/
├── UserPersonalInfo.tsx
├── UserAddressInfo.tsx
├── UserPermissions.tsx
└── UserForm.tsx
```

---

## Regla de Oro

Todo formulario debe cumplir:

- React Hook Form
- Zod
- zodResolver
- Tipado mediante z.infer
- Validaciones centralizadas en schemas
- Sin useState para manejar campos
- Sin validaciones manuales duplicadas

No se aceptarán formularios fuera de este estándar.

## Mensajes de Validación

### Idioma Obligatorio

Todos los mensajes de validación deben estar en español.

Está prohibido utilizar mensajes por defecto de Zod o mensajes en inglés.

❌ Incorrecto

```tsx
z.string().min(3);
```

Resultado:

```text
String must contain at least 3 character(s)
```

❌ Incorrecto

```tsx
z.string().email("Invalid email");
```

✅ Correcto

```tsx
z.string().email("Correo electrónico inválido");
```

✅ Correcto

```tsx
z.string().min(3, "El nombre debe tener al menos 3 caracteres");
```

---

## Mensajes Claros para el Usuario

Las validaciones deben ser comprensibles y orientadas al usuario.

❌ Incorrecto

```tsx
"Campo inválido";
```

```tsx
"Error";
```

```tsx
"Valor incorrecto";
```

✅ Correcto

```tsx
"Debe ingresar un correo electrónico válido";
```

```tsx
"La contraseña debe contener al menos 8 caracteres";
```

```tsx
"Debe seleccionar una fecha";
```

---

## Visualización de Errores

Todos los inputs deben mostrar los errores de validación.

Está prohibido ocultar errores o depender únicamente de notificaciones globales.

Cada campo debe renderizar su mensaje de error asociado.

❌ Incorrecto

```tsx
<Input {...field} />
```

✅ Correcto

```tsx
<Input {...field} />;

{
  errors.name && <span>{errors.name.message}</span>;
}
```

---

## Componentes Reutilizables de Formularios

Los componentes de formulario deben soportar errores de forma nativa.

Ejemplo:

```tsx
<FormInput control={control} name="email" label="Correo electrónico" />
```

Implementación:

```tsx
<Input {...field} />;

{
  error && <p>{error.message}</p>;
}
```

El desarrollador no debe tener que implementar manualmente la visualización de errores en cada formulario.

---

## Comportamiento Obligatorio

Todo campo debe:

- Mostrar error cuando falle una validación.
- Mostrar el mensaje generado por Zod.
- Mostrar mensajes en español.
- Mantener consistencia visual en toda la aplicación.

---

## Regla de Oro

No existe ningún campo de formulario sin feedback visual.

Todo input debe ser capaz de mostrar:

- Estado normal.
- Estado de error.
- Mensaje de validación.

Un formulario se considera incompleto si los errores no son visibles junto al campo correspondiente.

