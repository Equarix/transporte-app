import z from "zod";

export const Types = [
  {
    value: "location",
    label: "Lugar",
  },
  {
    value: "activity",
    label: "Actividad",
  },
  {
    value: "food",
    label: "Comida",
  },
];

export const ExperienceSchema = z.object({
  type: z.enum(["location", "activity", "food"], {
    error: "El tipo de experiencia es Obligatorio",
  }),
  name: z.string().min(2).max(100, {
    message: "El nombre de la experiencia debe tener entre 2 y 100 caracteres",
  }),
  description: z.string().min(10, {
    message:
      "La descripción de la experiencia debe tener al menos 10 caracteres",
  }),
  lat: z.string({
    error: "La latitud de la experiencia es Obligatoria",
  }),
  lng: z.string({
    error: "La longitud de la experiencia es Obligatoria",
  }),
  imageId: z.number({
    error: "La Imagen Es Obligatoria",
  }),
  imagePath: z.string(),
});

export type ExperienceType = z.infer<typeof ExperienceSchema>;
