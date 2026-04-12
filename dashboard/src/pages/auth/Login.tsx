import { useState } from "react";
import { Button, Input, Checkbox, Link, Form } from "@heroui/react";
import { LuEyeOff, LuEyeClosed } from "react-icons/lu";
import loginBg from "@/assets/images/login-bg.jpeg";
import { FaHotel } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth/login.schema";
import { useAuth } from "@/components/providers/AuthContext";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();

  return (
    <div className="flex h-screen w-full items-center py-12 justify-center relative">
      <img
        src={loginBg}
        className="absolute -z-1 max-h-screen w-full object-cover"
      />

      <div className="rounded-large flex w-full max-w-lg p-10 justify-center flex-col gap-4 bg-[#18181b] text-white">
        <div className="flex flex-col items-center pb-6">
          <FaHotel size={40} />
          <p className="text-xl font-medium">Bienvenido</p>
          <p className="text-small text-default-500">
            Inicia sesión en tu cuenta para continuar
          </p>
        </div>
        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit(login)}
        >
          <Input
            isRequired
            label="Número de documento"
            placeholder="Ingresa tu número de documento"
            variant="bordered"
            classNames={{
              label: "text-white!",
            }}
            {...register("documentNumber")}
            errorMessage={errors.documentNumber?.message}
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <LuEyeOff className="text-default-400 pointer-events-none text-2xl" />
                ) : (
                  <LuEyeClosed className="text-default-400 pointer-events-none text-2xl" />
                )}
              </button>
            }
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            classNames={{
              label: "text-white!",
            }}
            {...register("password")}
            errorMessage={errors.password?.message}
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox
              name="remember"
              size="sm"
              color="primary"
              classNames={{
                label: "text-white",
              }}
            >
              Recuérdame
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button className="w-full" color="primary" type="submit">
            Iniciar Sesión
          </Button>
        </Form>
      </div>
    </div>
  );
}
