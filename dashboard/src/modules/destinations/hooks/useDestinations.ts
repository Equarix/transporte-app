import { useAuth } from "@/components/providers/AuthContext";
import type {
  ApiResponse,
  ResponseDestination,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router";

export function useDestinations() {
  const { token } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useQuery<ApiResponse<ResponseDestination[]>>({
    queryKey: ["destinations", currentPage],
    queryFn: async () => {
      const response = await instance.get("/destination", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: 10,
        },
      });

      console.log(response.data);
      return response.data;
    },
  });

  const pagination = {
    pages: data ? data.metadata?.totalPages : 1,
    currentPage,
    setCurrentPage,
    totalItems: data ? data.metadata?.totalItems : 0,
    totalPages: data ? data.metadata?.totalPages : 1,
  };

  return { destinations: data?.body || [], pagination, isLoading, refetch };
}

export function useOperationsDestinations() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await instance.delete(`/destination/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      addToast({
        title: "Destino eliminado",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al eliminar destino",
        color: "danger",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await instance.patch(`/destination/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      addToast({
        title: "Destino actualizado",
        color: "success",
      });
      navigate("/destinations");
    },
    onError: () => {
      addToast({
        title: "Error al actualizar destino",
        color: "danger",
      });
    },
  });

  return {
    deleteDestination: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateDestination: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

export function useGetDestination(id?: string) {
  const { token } = useAuth();

  return useQuery<ApiResponse<ResponseDestination>>({
    queryKey: ["destination", id],
    queryFn: async () => {
      const response = await instance.get(`/destination/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!id,
  });
}
