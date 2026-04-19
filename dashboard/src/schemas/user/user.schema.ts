import z from "zod";

export enum RoleEnum {
  ADMIN = "admin",
  SELLER = "seller",
}

export enum TypeUser {
  EMPLOYEE = "EMPLOYEE",
  DRIVER = "DRIVER",
}

export enum TypeDocument {
  DNI = "DNI",
  PASSPORT = "PASSPORT",
}

export const userSchema = z.object({
  firstName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  lastName: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
  email: z.email("El email debe ser valido"),
  phone: z.string().min(7, "El telefono debe tener al menos 7 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  typeDocument: z.enum(TypeDocument, {
    error: "El tipo de documento debe ser DNI o PASSPORT",
  }),
  documentNumber: z
    .string()
    .min(7, "El numero de documento debe tener al menos 7 caracteres"),
  role: z.enum(RoleEnum, {
    error: "El rol debe ser admin, user o seller",
  }),
  typeUser: z.enum(TypeUser, {
    error: "El tipo de usuario debe ser employee o driver",
  }),
  dateOfBirth: z.date({
    error: "La fecha de nacimiento debe ser valida",
  }),
});

export type UserSchema = z.infer<typeof userSchema>;
