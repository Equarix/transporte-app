"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Cookie from "js-cookie";
import { instance } from "@/config/axios";
import type { ApiResponse } from "@/interface/utils.interface";
import { useMutation } from "@tanstack/react-query";
import type { AuthSchemaType } from "@/schema/auth/login.schema";
import { useRouter } from "next/navigation";
import { AuthResponse } from "@/interface/response.interface";
import { toast } from "sonner";
import { RegisterSchema } from "@/schema/auth/register.schema";

interface AuthContextProps {
  user?: AuthResponse;
  token: string;
  register: (data: RegisterSchema) => void;
  isLoadRegister: boolean;
  logout: () => void;
  setUser: (user: AuthResponse) => void;
  setToken: (token: string) => void;
  login: (data: AuthSchemaType) => void;
  isLoadLogin: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser, deleteUser] = useLocalStorage<AuthResponse | undefined>(
    "user",
    undefined,
  );
  const [token, setToken] = useState<string>(() => user?.token || "");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      Cookie.set("token", user.token);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete instance.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const { mutate: login, isPending: isLoadLogin } = useMutation({
    mutationFn: async (data: AuthSchemaType) => {
      const res = await instance.post("/public/auth/login", data);
      return res.data as ApiResponse<AuthResponse>;
    },
    onSuccess: ({ body, token }) => {
      setUser({
        ...body,
        token: token!,
      });
      setToken(token!);
      Cookie.set("token", token!);
      instance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
      toast.success("Inicio de sesión exitoso");
      router.push("/");
    },
    onError: () => {
      toast.error("Error al iniciar sesión");
    },
  });

  const { mutate: register, isPending: isLoadRegister } = useMutation({
    mutationFn: async (data: RegisterSchema) => {
      const res = await instance.post("/public/auth/register", data);
      return res.data as ApiResponse<AuthResponse>;
    },
    onSuccess: ({ body, token }) => {
      setUser({
        ...body,
        token: token!,
      });
      setToken(token!);
      Cookie.set("token", token!);
      instance.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
      toast.success("Registro exitoso");
      router.push("/");
    },
    onError: () => {
      toast.error("Error al registrar");
    },
  });

  const logout = () => {
    deleteUser();
    setToken("");
    Cookie.remove("token");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        register,
        isLoadRegister,
        logout,
        setUser,
        setToken,
        login,
        isLoadLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
