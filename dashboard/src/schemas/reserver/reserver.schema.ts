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
  reserverPriceFloors: z
    .array(
      z.object({
        price: z.number({
          error: "Precio requerido",
        }),
        floorId: z.number({
          error: "Floor requerido",
        }),
      }),
    )
    .min(1, {
      error: "Debe haber al menos un precio",
    }),
  reserverAgencies: z
    .array(
      z.object({
        agencyId: z.number({
          error: "Agencia requerida",
        }),
        hour: z.string({
          error: "Hora requerida",
        }),
      }),
    )
    .min(1, {
      error: "Debe haber al menos una agencia",
    }),
});

export type ReserverSchemeType = z.infer<typeof reserverSchema>;
