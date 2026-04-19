import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema, type UserSchema } from "@/schemas/user/user.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/libs/axios";
import { useAuth } from "@/components/providers/AuthContext";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router";
import type { AuthResponse } from "@/interface/response.interface";

interface UseUserFormProps {
  initialData?: AuthResponse;
  isUpdate?: boolean;
}

export function useUserForm({
  initialData,
  isUpdate = false,
}: UseUserFormProps = {}) {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData
      ? {
          firstName: initialData.profile.firstName,
          lastName: initialData.profile.lastName,
          email: initialData.profile.email,
          phone: initialData.profile.phone,
          password: "", // Password should probably not be populated but required (as per current backend)
          typeDocument: initialData.typeDocument as any,
          documentNumber: initialData.documentNumber,
          role: initialData.role as any,
          typeUser: initialData.profile.typeUser as any,
          dateOfBirth: initialData.profile.dateOfBirth
            ? new Date(initialData.profile.dateOfBirth)
            : undefined,
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          documentNumber: "",
        },
  });

  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UserSchema) => {
      if (isUpdate && initialData) {
        const res = await instance.patch(`/user/${initialData.userId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      } else {
        const res = await instance.post("/user", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      }
    },
    onSuccess: () => {
      addToast({
        title: isUpdate ? "Usuario actualizado" : "Usuario creado",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/user");
    },
    onError: () => {
      addToast({
        title: isUpdate ? "Error al actualizar usuario" : "Error al crear usuario",
        color: "danger",
      });
    },
  });

  const onSubmit = form.handleSubmit((data: UserSchema) => {
    mutate(data);
  });

  return {
    form,
    onSubmit,
    isPending,
  };
}
