import { useAuth } from "@/components/providers/AuthContext";
import type {
  ApiResponse,
  ResponseAgency,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router";

export function useAgency() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery<ApiResponse<ResponseAgency[]>>({
    queryKey: ["agencies", currentPage],
    queryFn: async () => {
      const res = await instance.get("/agency", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: 10,
        },
      });

      console.log(res.data);
      return res.data;
    },
  });

  const pagination = {
    pages: data ? data.metadata?.totalPages : 1,
    currentPage,
    setCurrentPage,
    totalItems: data ? data.metadata?.totalItems : 0,
    totalPages: data ? data.metadata?.totalPages : 1,
  };

  return { agencies: data?.body || [], pagination, isLoading };
}

export function useOperationsAgency() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await instance.delete(`/agency/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      addToast({
        title: "Agencia eliminada",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al eliminar agencia",
        color: "danger",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await instance.patch(`/agency/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      addToast({
        title: "Agencia actualizada",
        color: "success",
      });
      navigate("/agency");
    },
    onError: () => {
      addToast({
        title: "Error al actualizar agencia",
        color: "danger",
      });
    },
  });

  return {
    deleteAgency: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateAgency: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

export function useGetAgency(id?: string) {
  const { token } = useAuth();

  return useQuery<ApiResponse<ResponseAgency>>({
    queryKey: ["agency", id],
    queryFn: async () => {
      const response = await instance.get(`/agency/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!id,
  });
}

export function useGetUsersAgency() {
  const { token } = useAuth();

  return useQuery<ApiResponse<ResponseAgency[]>>({
    queryKey: ["users-agency"],
    queryFn: async () => {
      const response = await instance.get(`/agency/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
}

export function useUserAgency(id: string) {
  const { token } = useAuth();

  const query = useQuery<ApiResponse<ResponseAgency[]>>({
    queryKey: ["user-agency", id],
    queryFn: async () => {
      const response = await instance.get(`/agency/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: !!id,
  });

  const addUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await instance.post(`/agency/add-user`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      addToast({
        title: "Usuario agregado",
        color: "success",
      });
      query.refetch();
    },
    onError: () => {
      addToast({
        title: "Error al agregar usuario",
        color: "danger",
      });
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await instance.delete(`/agency/remove-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      });
      return response.data;
    },
    onSuccess: () => {
      addToast({
        title: "Usuario eliminado",
        color: "success",
      });
      query.refetch();
    },
    onError: () => {
      addToast({
        title: "Error al eliminar usuario",
        color: "danger",
      });
    },
  });

  return {
    query,
    addUserMutation,
    removeUserMutation,
  };
}
