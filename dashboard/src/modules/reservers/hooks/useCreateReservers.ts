import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  reserverSchema,
  type ReserverSchemeType,
} from "@/schemas/reserver/reserver.schema";
import { instance } from "@/libs/axios";
import { useAuth } from "@/components/providers/AuthContext";
import type {
  ApiResponse,
  Profile,
  ResponseBus,
  ResponseDestination,
} from "@/interface/response.interface";

export function useCreateReservers() {
  const { token } = useAuth();

  const form = useForm({
    resolver: zodResolver(reserverSchema),
  });

  const createReserver = useMutation({
    mutationFn: async (data: ReserverSchemeType) => {
      const res = await instance.post("/reservers", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { data: resDrivers, isLoading: isLoadingDrivers } = useQuery<
    ApiResponse<Profile[]>
  >({
    queryKey: ["drivers"],
    queryFn: async () => {
      const res = await instance.get("/user/drivers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { data: resBus, isLoading: isLoadingBus } = useQuery<
    ApiResponse<ResponseBus[]>
  >({
    queryKey: ["bus"],
    queryFn: async () => {
      const res = await instance.get("/bus/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { data: resDestination, isLoading: isLoadingDestination } = useQuery<
    ApiResponse<ResponseDestination[]>
  >({
    queryKey: ["destination"],
    queryFn: async () => {
      const res = await instance.get("/destination/get-all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    createReserver.mutate(data);
  });

  const isLoading =
    createReserver.isPending ||
    isLoadingDrivers ||
    isLoadingBus ||
    isLoadingDestination;

  return {
    form,
    handleSubmit,
    createReserver,
    drivers: {
      resDrivers,
      isLoadingDrivers,
    },
    bus: {
      resBus,
      isLoadingBus,
    },
    destination: {
      resDestination,
      isLoadingDestination,
    },
    isLoading,
  };
}
