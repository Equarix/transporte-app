"use client";

import Button from "@/components/ui/button/Button";
import Hero from "@/components/ui/hero/Hero";
import HeroCaption from "@/components/ui/hero/HeroCaption";
import HeroDescripcion from "@/components/ui/hero/HeroDescripcion";
import HeroTitle from "@/components/ui/hero/HeroTitle";
import Input from "@/components/ui/input/Input";
import SelectForm from "@/components/ui/select-form/SelectForm";
import DayPickerForm from "@/components/ui/day-picker-form/DayPickerForm";
import { useAuth } from "@/context/AuthContext";
import { registerSchema, RegisterSchema } from "@/schema/auth/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import {
  LuArrowRight,
  LuIdCard,
  LuUser,
  LuMail,
  LuPhone,
  LuLock,
} from "react-icons/lu";

const documentOptions = [
  { label: "DNI", value: "DNI" },
  { label: "Pasaporte", value: "PASSPORT" },
  { label: "Carnet de Extranjería", value: "CE" },
];

export default function RegisterPage() {
  const { control, handleSubmit } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      typeDocument: "",
      documentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const { register } = useAuth();

  const onSubmit = handleSubmit((data) => {
    register(data);
  });

  return (
    <main className="w-full max-h-screen grid grid-cols-2 overflow-hidden">
      <Hero
        image="/banner-login.png"
        className={{
          imagebg: "opacity-80",
          wrapper: "bg-black/40 items-end pb-16",
        }}
      >
        <HeroCaption className="text-white">
          <HeroTitle>Descubre el Perú</HeroTitle>
          <HeroDescripcion className="text-white">
            Confort y seguridad en cada kilómetro de tu próxima aventura.
          </HeroDescripcion>
        </HeroCaption>
      </Hero>

      <form
        onSubmit={onSubmit}
        className="w-full flex overflow-y-auto h-screen flex-col items-center gap-6 py-12"
      >
        <div className="px-20 w-full max-w-2xl ">
          <header className="space-y-2 mb-8">
            <h1 className="font-bold text-3xl">Crea tu cuenta</h1>
            <p className="text-gray-500">
              Completa el formulario para crear tu cuenta.
            </p>
          </header>

          <section className="grid grid-cols-2 gap-6 w-full">
            {/* Tipo de Documento */}
            <div className="col-span-2 md:col-span-1">
              <Controller
                control={control}
                name="typeDocument"
                render={({ field, fieldState }) => (
                  <SelectForm
                    icon={<LuIdCard />}
                    items={documentOptions}
                    label="Tipo de Documento"
                    placeholder="Elige el tipo de documento"
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            {/* Número de Documento */}
            <div className="col-span-2 md:col-span-1">
              <Controller
                control={control}
                name="documentNumber"
                render={({ field, fieldState }) => (
                  <Input
                    label="Número de documento"
                    icon={<LuIdCard />}
                    placeholder="87654321"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Nombres */}
            <div className="col-span-2 md:col-span-1">
              <Controller
                control={control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Input
                    label="Nombres"
                    icon={<LuUser />}
                    placeholder="Jane"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Apellidos */}
            <div className="col-span-2 md:col-span-1">
              <Controller
                control={control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Input
                    label="Apellidos"
                    icon={<LuUser />}
                    placeholder="Smith"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Correo Electrónico */}
            <div className="col-span-2">
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Input
                    label="Correo Electrónico"
                    icon={<LuMail />}
                    placeholder="jane.smith@example.com"
                    type="email"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Teléfono */}
            <div className="col-span-2 md:col-span-1">
              <Controller
                control={control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Input
                    label="Teléfono"
                    icon={<LuPhone />}
                    placeholder="987123456"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div className="col-span-2 md:col-span-1">
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field, fieldState }) => (
                  <DayPickerForm
                    label="Fecha de Nacimiento"
                    placeholder="10/10/1995"
                    onChange={field.onChange}
                    value={field.value}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>

            {/* Contraseña */}
            <div className="col-span-2">
              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <Input
                    label="Contraseña"
                    icon={<LuLock />}
                    placeholder="••••••••"
                    type="password"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Botón de envío */}
            <div className="col-span-2 mt-4">
              <Button
                type="submit"
                className="bg-linear-to-r from-amber-600 to-amber-800 text-white flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg cursor-pointer"
              >
                Regístrate <LuArrowRight />
              </Button>
            </div>
          </section>
        </div>

        <p className="text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-amber-700 font-semibold hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </main>
  );
}
