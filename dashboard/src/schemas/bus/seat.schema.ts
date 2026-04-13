import z from "zod";

export const SeatSchema = z
  .object({
    name: z.string().default(""),
    typeSeat: z.enum(["asiento", "limpieza", "escalera"]),
    row: z.number({
      error: "El Orden es requerido",
    }),
    column: z.number({
      error: "La Columna es requerida",
    }),
  })
  .refine(
    (data) => {
      if (data.typeSeat === "asiento") {
        return data.name.trim().length > 0;
      }
      return true;
    },
    {
      message: "El nombre es requerido",
      path: ["name"],
    }
  );

export type SeatSchemaType = z.infer<typeof SeatSchema>;
