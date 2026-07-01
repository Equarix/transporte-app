import { useAuth } from "@/components/providers/AuthContext";
import type {
  ApiResponse,
  ResponseReserver,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { StatusReserverEnum } from "../enum/status-reserver.enum";
import { addToast } from "@heroui/react";

export function useReservers() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatusState] = useState<string>("");
  const [date, setDateState] = useState<string>("");

  const setStatus = (val: string) => {
    setStatusState(val);
    setCurrentPage(1);
  };

  const setDate = (val: string) => {
    setDateState(val);
    setCurrentPage(1);
  };

  const { data, isLoading, refetch } = useQuery<
    ApiResponse<ResponseReserver[]>
  >({
    queryKey: ["reservers", currentPage, status, date],
    queryFn: async () => {
      const params: Record<string, any> = {
        page: currentPage,
        limit: 10,
      };
      if (status) params.status = status;
      if (date) params.date = date;

      const response = await instance.get("/reserver", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
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

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      id,
      status: mutationStatus,
    }: {
      id: number;
      status: StatusReserverEnum;
    }) => {
      const response = await instance.put(
        `/reserver/${id}`,
        {
          status: mutationStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      refetch();
      addToast({
        title: "Estado actualizado",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al actualizar el estado",
        color: "danger",
      });
    },
  });

  return {
    data,
    isLoading,
    pagination,
    mutate,
    isPending,
    status,
    setStatus,
    date,
    setDate,
  };
}

