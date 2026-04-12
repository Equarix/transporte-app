import z from "zod";
import { ExperienceSchema } from "./experience.schema";

export const DestinationsSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre del destino debe tener al menos 2 caracteres",
    })
    .max(100),
  shortDescription: z
    .string()
    .min(10, {
      message: "La descripción corta debe tener al menos 10 caracteres",
    })
    .max(255),
  longDescription: z.string().min(20, {
    message: "La descripción larga debe tener al menos 20 caracteres",
  }),
  lat: z.string({
    error: "La latitud del destino es Obligatoria",
  }),
  lng: z.string({
    error: "La longitud del destino es Obligatoria",
  }),
  experiences: z.array(ExperienceSchema).min(1, {
    message: "Debe haber al menos una experiencia para el destino",
  }),
  imageId: z.number({
    error: "La Imagen Es Obligatoria",
  }),
});

export type DestinationsType = z.infer<typeof DestinationsSchema>;
