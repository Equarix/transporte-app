import { z } from "zod";

export const findTravelSchema = z.object({
  origin: z.string().min(1, "El origen es requerido"),
  destination: z.string().min(1, "El destino es requerido"),
  checkIn: z.date().min(1, "La fecha de ida es requerida"),
});

export type FindTravelFormData = z.infer<typeof findTravelSchema>;
