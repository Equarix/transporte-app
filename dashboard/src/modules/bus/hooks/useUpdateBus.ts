import {
  UpdateBusSchema,
  type UpdateBusSchemaType,
} from "@/schemas/bus/update/update-bus.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { instance } from "@/libs/axios";
import { useAuth } from "@/components/providers/AuthContext";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import type { ApiResponse, ResponseBus } from "@/interface/response.interface";

export function useUpdateBus(id: string | undefined) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: busResponse, isLoading: isFetching } = useQuery<
    ApiResponse<ResponseBus>
  >({
    queryKey: ["bus", id],
    queryFn: async () => {
      const res = await instance.get(`/bus/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!id,
  });

  const form = useForm({
    resolver: zodResolver(UpdateBusSchema),
    defaultValues: {
      name: "",
      plate: "",
      model: "",
      year: new Date().getFullYear(),
      capacity: 0,
      type: "",
      floors: [],
    },
  });

  useEffect(() => {
    if (busResponse?.body) {
      console.log(busResponse);
      const bus = busResponse.body;
      form.reset({
        name: bus.name || "",
        plate: bus.plate || "",
        model: bus.model || "",
        year: bus.year || new Date().getFullYear(),
        capacity: bus.capacity || 0,
        type: bus.type || "",
        floors: bus.floors.map((f) => ({
          floorId: f.floorId || 0,
          name: f.name || "",
          order: f.order || 1,
          columns: f.columns || 4,
          rows: f.rows || 5,
          status: f.status !== false, // Default true if undefined
          seats: f.seats.map((s) => ({
            seatId: s.seatId || 0,
            name: s.name || "",
            typeSeat: s.typeSeat as any,
            row: s.row || 1,
            column: s.column || 1,
            status: s.status !== false,
          })),
        })),
      });
    }
  }, [busResponse, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateBusSchemaType) => {
      const response = await instance.patch(`/bus/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      queryClient.invalidateQueries({ queryKey: ["bus", id] });
      addToast({
        title: "Bus actualizado",
        description: "El bus ha sido actualizado exitosamente",
        color: "success",
      });
      navigate("/bus");
    },
    onError: (error: any) => {
      addToast({
        title: "Error al actualizar bus",
        description:
          error.response?.data?.message || "Ocurrió un error inesperado",
        color: "danger",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    isPending: updateMutation.isPending,
    isFetching,
    bus: busResponse?.body,
  };
}
