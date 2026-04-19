import { useAuth } from "@/components/providers/AuthContext";
import type { ApiResponse, AuthResponse } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useUser() {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery<ApiResponse<AuthResponse[]>>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await instance.get("/user", {
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
    users: data?.body || [],
    pagination,
    isLoading,
  };
}

export function useGetUserById(id: string | undefined) {
  const { token } = useAuth();

  return useQuery<ApiResponse<AuthResponse>>({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await instance.get(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    enabled: !!id,
  });
}
export function useSearchUsers(documentNumber: string) {
  const { token } = useAuth();

  return useQuery<ApiResponse<AuthResponse[]>>({
    queryKey: ["user", "search", documentNumber],
    queryFn: async () => {
      const res = await instance.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          documentNumber,
          page: 1,
          limit: 10,
        },
      });

      return res.data;
    },
    enabled: documentNumber.length > 2,
  });
}
