import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthContext';
import { promosService } from '../services/promos.service';

export function usePromos() {
  const { token } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['promos'],
    queryFn: () => promosService.getAll(token ?? ''),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 min
  });

  return {
    promos: data ?? [],
    isLoading,
    error,
    refetch,
  };
}
