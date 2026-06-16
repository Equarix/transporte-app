import { z } from "zod";

export const reviewSchema = z.object({
  comfortScore: z.number().min(1, "Debe calificar la comodidad").max(5),
  punctualityScore: z.number().min(1, "Debe calificar la puntualidad").max(5),
  serviceScore: z.number().min(1, "Debe calificar el servicio").max(5),
  driverScore: z.number().min(1, "Debe calificar al conductor").max(5),
  comment: z.string().max(500, "El comentario no debe exceder los 500 caracteres").optional(),
});

export type ReviewForm = z.infer<typeof reviewSchema>;
