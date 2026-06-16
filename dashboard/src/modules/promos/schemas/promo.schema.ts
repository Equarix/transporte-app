import { z } from 'zod';
import { DiscountMode, PromoApplicableTo, PromoType } from '../types/promo.types';

export const promoSchema = z
  .object({
    code: z
      .string()
      .min(3, 'El código debe tener al menos 3 caracteres')
      .max(50, 'El código no puede superar los 50 caracteres'),

    name: z
      .string()
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(150, 'El nombre no puede superar los 150 caracteres'),

    description: z
      .string()
      .max(500, 'La descripción no puede superar los 500 caracteres')
      .optional(),

    promoType: z.nativeEnum(PromoType, {
      required_error: 'Debe seleccionar un tipo de promo',
    }),

    discountMode: z.nativeEnum(DiscountMode).optional(),

    discountValue: z.coerce
      .number()
      .positive('El valor debe ser positivo')
      .optional(),

    maxDiscountCap: z.coerce
      .number()
      .min(0, 'El tope máximo no puede ser negativo')
      .optional(),

    giftDescription: z
      .string()
      .min(3, 'La descripción del regalo debe tener al menos 3 caracteres')
      .max(200, 'La descripción no puede superar los 200 caracteres')
      .optional(),

    applicableTo: z.nativeEnum(PromoApplicableTo, {
      required_error: 'Debe seleccionar a qué aplica la promo',
    }),

    minimumPurchaseAmount: z.coerce
      .number()
      .min(0, 'El monto mínimo no puede ser negativo')
      .optional(),

    applicableRouteIds: z.string().optional(),
    applicableAgencyIds: z.string().optional(),

    startsAt: z.string().min(1, 'Debe seleccionar una fecha de inicio'),
    expiresAt: z.string().min(1, 'Debe seleccionar una fecha de vencimiento'),

    maxGlobalUses: z.coerce
      .number()
      .int('Debe ser un número entero')
      .positive('Debe ser mayor a 0')
      .optional(),

    maxUsesPerUser: z.coerce
      .number()
      .int('Debe ser un número entero')
      .positive('Debe ser mayor a 0')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.promoType === PromoType.DESCUENTO) {
      if (!data.discountMode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debe seleccionar el modo de descuento',
          path: ['discountMode'],
        });
      }
      if (data.discountValue === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Debe ingresar el valor del descuento',
          path: ['discountValue'],
        });
      }
      if (
        data.discountMode === DiscountMode.PORCENTAJE &&
        data.discountValue !== undefined &&
        data.discountValue > 100
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El porcentaje no puede superar el 100%',
          path: ['discountValue'],
        });
      }
    }

    if (data.promoType === PromoType.REGALO && !data.giftDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debe describir el regalo que se entrega',
        path: ['giftDescription'],
      });
    }

    if (data.startsAt && data.expiresAt && data.startsAt >= data.expiresAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La fecha de vencimiento debe ser posterior a la de inicio',
        path: ['expiresAt'],
      });
    }
  });

export type PromoFormValues = z.infer<typeof promoSchema>;
