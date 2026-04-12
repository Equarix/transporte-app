import { CreateBusSchema, type CreateBusSchemaType } from "@/schemas/bus/bus.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/libs/axios";
import { useAuth } from "@/components/providers/AuthContext";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router";

export function useCreateBus() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<CreateBusSchemaType>({
    resolver: zodResolver(CreateBusSchema),
    defaultValues: {
      name: "",
      plate: "",
      model: "",
      year: new Date().getFullYear(),
      capacity: 0,
      type: "",
      floors: [
        {
          name: "Primer Piso",
          order: 1,
          columns: 4,
          rows: 5,
          seats: [],
        },
      ],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateBusSchemaType) => {
      const response = await instance.post("/bus", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buses"] });
      addToast({
        title: "Bus creado",
        description: "El bus ha sido creado exitosamente",
        color: "success",
      });
      navigate("/bus");
    },
    onError: (error: any) => {
      addToast({
        title: "Error al crear bus",
        description: error.response?.data?.message || "Ocurrió un error inesperado",
        color: "danger",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending,
  };
}
