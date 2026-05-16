"use client";
import Button from "@/components/ui/button/Button";
import Hero from "@/components/ui/hero/Hero";
import HeroCaption from "@/components/ui/hero/HeroCaption";
import HeroDescripcion from "@/components/ui/hero/HeroDescripcion";
import HeroTitle from "@/components/ui/hero/HeroTitle";
import Input from "@/components/ui/input/Input";
import SelectForm from "@/components/ui/select-form/SelectForm";
import { useAuth } from "@/context/AuthContext";
import { loginSchema } from "@/schema/auth/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { LuArrowRight, LuIdCard, LuLock } from "react-icons/lu";

export enum TypeDocument {
  DNI = "DNI",
  PASSPORT = "PASSPORT",
  DRIVER_LICENSE = "DRIVER_LICENSE",
}

const options = [
  { label: "DNI", value: TypeDocument.DNI },
  { label: "Pasaporte", value: TypeDocument.PASSPORT },
  { label: "Licencia de Conducir", value: TypeDocument.DRIVER_LICENSE },
];

export default function LoginPage() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = handleSubmit((data) => {
    login(data);
  });

  return (
    <main className="w-full h-screen grid grid-cols-2">
      <Hero
        image="/banner-login.png"
        className={{
          imagebg: "opacity-80",
          wrapper: "bg-black/40",
        }}
      >
        <HeroCaption className="text-white max-w-60">
          <HeroTitle>Tu próximo destino comienza aquí</HeroTitle>
          <HeroDescripcion className="text-white">
            Viaja con la comodidad y seguridad que mereces. Descubre nuevas
            rutas y vive la experiencia Ittsabus.
          </HeroDescripcion>
        </HeroCaption>
      </Hero>

      <form
        className="w-full flex flex-col items-center justify-center gap-10"
        onSubmit={onSubmit}
      >
        <header className="space-y-2">
          <h1 className="font-bold text-3xl">Bienvenido de nuevo</h1>
          <p>Ingresa tus credenciales para acceder a tu cuenta.</p>
        </header>

        <section className="space-y-6 max-w-95 w-full">
          <Controller
            control={control}
            name="typeDocument"
            render={({ field, fieldState }) => (
              <SelectForm
                icon={<LuIdCard />}
                items={options}
                label="Tipo de Documento"
                placeholder="Elige el tipo de documento"
                onChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="documentNumber"
            render={({ field, fieldState }) => (
              <Input
                label="Numero de documento"
                icon={<LuIdCard />}
                placeholder="XXXXXXX"
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                icon={<LuLock />}
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <Button
            className="bg-linear-to-r from-amber-600 to-amber-800 text-white"
            icon
          >
            Iniciar Sesión <LuArrowRight />
          </Button>
        </section>
        <p>
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/register" className="text-amber-700 font-semibold">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </main>
  );
}
