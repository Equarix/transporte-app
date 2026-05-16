import { z } from "zod";

export const registerSchema = z.object({
  typeDocument: z
    .string({
      error: "El tipo de documento es obligatorio",
    })
    .min(1, "El tipo de documento no puede estar vacío"),

  documentNumber: z
    .string({
      error: "El número de documento es obligatorio",
    })
    .min(8, "El número de documento debe tener al menos 8 caracteres")
    .max(20, "El número de documento no puede exceder 20 caracteres"),

  firstName: z
    .string({
      error: "El nombre es obligatorio",
    })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),

  lastName: z
    .string({
      error: "El apellido es obligatorio",
    })
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede exceder 100 caracteres"),

  email: z.email({
    error: "El correo electrónico es obligatorio",
  }),

  phone: z
    .string({
      error: "El teléfono es obligatorio",
    })
    .regex(/^[0-9]+$/, "El teléfono solo debe contener números")
    .min(9, "El teléfono debe tener al menos 9 dígitos")
    .max(15, "El teléfono no puede exceder 15 dígitos"),

  dateOfBirth: z.date({
    message: "La fecha de nacimiento debe tener un formato ISO válido",
  }),

  password: z
    .string({
      error: "La contraseña es obligatoria",
    })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
