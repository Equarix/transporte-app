import { z } from "zod";

export const loginSchema = z.object({
  documentNumber: z.string().min(1, "El número de documento es requerido"),
  password: z.string().min(3, "La contraseña debe tener al menos 6 caracteres"),
});

export type AuthSchemaType = z.infer<typeof loginSchema>;
