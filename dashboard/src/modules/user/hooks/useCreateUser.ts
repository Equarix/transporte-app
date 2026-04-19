import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema, type UserSchema } from "@/schemas/user/user.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/libs/axios";
import { useAuth } from "@/components/providers/AuthContext";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router";

export function useCreateUser() {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
  });
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending: isCreatingUser } = useMutation({
    mutationFn: (data: UserSchema) => {
      return instance.post("/user", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      addToast({
        title: "Usuario creado",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/user");
    },
    onError: () => {
      addToast({
        title: "Error al crear usuario",
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
    isCreatingUser,
  };
}
