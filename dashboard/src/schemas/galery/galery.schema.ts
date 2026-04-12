import z from "zod";

export const GalerySchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "El tamaño del archivo debe ser menor o igual a 5MB",
  }),
});

export type GaleryType = z.infer<typeof GalerySchema>;
