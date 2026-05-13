import z from "zod";
import { FloorSchema } from "../floor.schema";
import { UpdateSeatSchema } from "./update-seat.schema";

export const UpdateFloorSchema = FloorSchema.extend({
  floorId: z.number(),
  status: z.boolean(),
  seats: z.array(UpdateSeatSchema),
});

export type UpdateFloorSchemaType = z.infer<typeof UpdateFloorSchema>;
