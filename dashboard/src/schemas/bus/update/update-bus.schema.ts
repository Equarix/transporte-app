import z from "zod";
import { BusSchema } from "../bus.schema";
import { UpdateFloorSchema } from "./update-floor.schemat";

export const UpdateBusSchema = BusSchema.extend({
  floors: z.array(UpdateFloorSchema),
});

export type UpdateBusSchemaType = z.infer<typeof UpdateBusSchema>;
