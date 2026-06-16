import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ingresar un correo electrónico válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  dateOfBirth: z.date({
    message: "La fecha de nacimiento es requerida",
  }),
});

export type ProfileForm = z.infer<typeof profileSchema>;
