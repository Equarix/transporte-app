import { z } from "zod";

export const loginSchema = z.object({
  typeDocument: z
    .string({
      error: "El tipo de documento es requerido",
    })
    .min(1, "El tipo de documento es requerido"),
  documentNumber: z
    .string({
      error: "El número de documento es requerido",
    })
    .min(1, "El número de documento es requerido"),
  password: z
    .string({
      error: "La contraseña es requerida",
    })
    .min(3, "La contraseña debe tener al menos 6 caracteres"),
});

export type AuthSchemaType = z.infer<typeof loginSchema>;
