import z from "zod";

export const SeatSchema = z.object({
  name: z.string({
    error: "El Nombre es requerido",
  }),
  typeSeat: z.enum(["asiento", "limpieza", "escalera"]),
  row: z.number({
    error: "El Orden es requerido",
  }),
  column: z.number({
    error: "La Columna es requerida",
  }),
});

export type SeatSchemaType = z.infer<typeof SeatSchema>;
