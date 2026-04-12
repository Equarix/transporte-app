import z from "zod";

export const FloorSchema = z.object({
  name: z.string().min(1, "El Nombre es requerido"),
  order: z.number().min(1, "El Orden es requerido"),
  columns: z.number().min(1, "El Numero de columnas es requerido"),
  rows: z.number().min(1, "El Numero de filas es requerido"),
});

export type FloorSchemaType = z.infer<typeof FloorSchema>;
