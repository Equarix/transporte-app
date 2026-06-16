---
trigger: always_on
---

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
