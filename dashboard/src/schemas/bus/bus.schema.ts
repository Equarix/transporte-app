import { z } from "zod";
import { FloorSchema } from "./floor.schema";
import { SeatSchema } from "./seat.schema";

export const BusSchema = z.object({
  name: z.string().min(1, "El Nombre es requerido"),
  plate: z.string().min(1, "La Placa es requerida"),
  model: z.string().min(1, "El Modelo es requerido"),
  year: z.number().min(1, "El Año es requerido"),
  capacity: z.number().min(1, "La Capacidad es requerida"),
  type: z.string().min(1, "El Tipo es requerido"),
});

export type BusSchemaType = z.infer<typeof BusSchema>;

export const CreateBusSchema = BusSchema.extend({
  floors: z.array(
    FloorSchema.extend({
      seats: z.array(SeatSchema),
    }),
  ),
});

export type CreateBusSchemaType = z.infer<typeof CreateBusSchema>;
