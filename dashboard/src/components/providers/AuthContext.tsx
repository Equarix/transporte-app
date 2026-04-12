import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Cookie from "js-cookie";
import { instance } from "@/libs/axios";
import type { ApiResponse, AuthResponse } from "@/interface/response.interface";
import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router";
import type { AuthSchemaType } from "@/schemas/auth/login.schema";

interface AuthContextProps {
  user?: AuthResponse;
  token: string;
  // register: (data: RegisterSchemaType) => void;
  // isLoadRegister: boolean;
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
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      Cookie.set("token", user.token);
    }
  }, [user]);

  const { mutate: login, isPending: isLoadLogin } = useMutation({
    mutationFn: async (data: AuthSchemaType) => {
      const res = await instance.post("/auth/login-admin", data);
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
      addToast({
        title: "Inicio de sesión exitoso",
        color: "success",
      });
      navigate("/");
    },
    onError: () => {
      addToast({
        title: "Error al iniciar sesión",
        color: "danger",
      });
    },
  });

  const logout = () => {
    deleteUser();
    setToken("");
    Cookie.remove("token");
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        // register,
        // isLoadRegister,
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
