import { useAuth } from "@/components/providers/AuthContext";
import type { ApiResponse, ResponseBus } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useBus() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery<ApiResponse<ResponseBus[]>>({
    queryKey: ["bus", currentPage],
    queryFn: async () => {
      const res = await instance.get("/bus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: 10,
        },
      });
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

  return {
    bus: data?.body || [],
    pagination,
    isLoading,
  };
}
