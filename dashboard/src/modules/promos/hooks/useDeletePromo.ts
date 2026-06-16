import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthContext';
import { addToast } from '@heroui/react';
import { promosService } from '../services/promos.service';

interface UseDeletePromoOptions {
  onSuccess?: () => void;
}

export function useDeletePromo({ onSuccess }: UseDeletePromoOptions = {}) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => promosService.remove(id, token ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promos'] });
      addToast({ title: 'Promo eliminada', color: 'success' });
      onSuccess?.();
    },
    onError: () => {
      addToast({ title: 'Error al eliminar la promo', color: 'danger' });
    },
  });

  return { deletePromo: mutate, isDeleting: isPending };
}
