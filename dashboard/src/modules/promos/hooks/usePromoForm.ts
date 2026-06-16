import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthContext';
import { addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { promoSchema, type PromoFormValues } from '../schemas/promo.schema';
import { promosService } from '../services/promos.service';
import type { Promo } from '../types/promo.types';

interface UseCreatePromoOptions {
  onSuccess?: () => void;
}

export function useCreatePromo({ onSuccess }: UseCreatePromoOptions = {}) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<PromoFormValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      minimumPurchaseAmount: 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PromoFormValues) =>
      promosService.create(data, token ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promos'] });
      addToast({ title: 'Promo creada correctamente', color: 'success' });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      addToast({ title: 'Error al crear la promo', color: 'danger' });
    },
  });

  const handleSubmit = form.handleSubmit((data) => mutate(data));

  return { form, handleSubmit, isPending };
}

interface UseUpdatePromoOptions {
  promo: Promo;
  onSuccess?: () => void;
}

export function useUpdatePromo({ promo, onSuccess }: UseUpdatePromoOptions) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<PromoFormValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      code: promo.code,
      name: promo.name,
      description: promo.description ?? undefined,
      promoType: promo.promoType,
      discountMode: promo.discountMode ?? undefined,
      discountValue: promo.discountValue ?? undefined,
      maxDiscountCap: promo.maxDiscountCap ?? undefined,
      giftDescription: promo.giftDescription ?? undefined,
      applicableTo: promo.applicableTo,
      minimumPurchaseAmount: promo.minimumPurchaseAmount,
      applicableRouteIds: promo.applicableRouteIds ?? undefined,
      applicableAgencyIds: promo.applicableAgencyIds ?? undefined,
      startsAt: promo.startsAt.slice(0, 16),
      expiresAt: promo.expiresAt.slice(0, 16),
      maxGlobalUses: promo.maxGlobalUses ?? undefined,
      maxUsesPerUser: promo.maxUsesPerUser ?? undefined,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PromoFormValues) =>
      promosService.update(promo.promoId, data, token ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promos'] });
      addToast({ title: 'Promo actualizada', color: 'success' });
      onSuccess?.();
    },
    onError: () => {
      addToast({ title: 'Error al actualizar la promo', color: 'danger' });
    },
  });

  const handleSubmit = form.handleSubmit((data) => mutate(data));

  return { form, handleSubmit, isPending };
}
