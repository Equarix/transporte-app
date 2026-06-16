import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthContext';
import { addToast } from '@heroui/react';
import { resenasService } from '../services/resenas.service';

export function useReviews() {
  const { token } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => resenasService.getAll(token ?? ''),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 min
  });

  return {
    reviews: data ?? [],
    isLoading,
    error,
    refetch,
  };
}

export function useReviewMetrics() {
  const { token } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reviewMetrics'],
    queryFn: () => resenasService.getMetrics(token ?? ''),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 min
  });

  return {
    metrics: data,
    isLoading,
    error,
    refetch,
  };
}

export function useDeleteReview() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => resenasService.remove(id, token ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviewMetrics'] });
      addToast({ title: 'Reseña eliminada con éxito', color: 'success' });
    },
    onError: () => {
      addToast({ title: 'Error al eliminar la reseña', color: 'danger' });
    },
  });

  return { deleteReview: mutate, isDeleting: isPending };
}
