import z from "zod";

export const reserverSchema = z.object({
  date: z.date({
    error: "Fecha requerida",
  }),
  checkInId: z.number({
    error: "Check in requerido",
  }),
  checkOutId: z.number({
    error: "Check out requerido",
  }),
  busId: z.number({
    error: "Bus requerido",
  }),
  driverId: z.number({
    error: "Conductor requerido",
  }),
});

export type ReserverSchemeType = z.infer<typeof reserverSchema>;
