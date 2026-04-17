import { z } from "zod";

export const AgencyServiceSchema = z.object({
  icon: z.string({
    error: "El icono es requerido",
  }),
  name: z
    .string({
      error: "El nombre es requerido",
    })
    .min(1, "El nombre es requerido"),
});

export const AgencySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().min(1, "El teléfono es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  lat: z.string().min(1, "La latitud es requerida"),
  lng: z.string().min(1, "La longitud es requerida"),
  largeAddress: z.string().min(1, "La Direccion larga es requerida"),
  imageId: z.number().min(1, "La imagen es requerida"),
  services: z.array(AgencyServiceSchema).min(1, "Los servicios son requeridos"),
});

export type AgencySchemaType = z.infer<typeof AgencySchema>;
