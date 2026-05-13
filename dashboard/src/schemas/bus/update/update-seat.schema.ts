import z from "zod";
import { SeatSchema } from "../seat.schema";

export const UpdateSeatSchema = SeatSchema.extend({
  seatId: z.number(),
  status: z.boolean(),
});

export type UpdateSeatSchemaType = z.infer<typeof UpdateSeatSchema>;
