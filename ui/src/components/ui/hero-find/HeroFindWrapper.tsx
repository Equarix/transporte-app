"use client";
import Hero from "../hero/Hero";
import HeroCaption from "../hero/HeroCaption";
import HeroDescripcion from "../hero/HeroDescripcion";
import HeroTitle from "../hero/HeroTitle";
import { Destination } from "@/interface/response.interface";
import Select from "../select/Select";
import { LuCalendar, LuMapPin } from "react-icons/lu";
import { TbSend } from "react-icons/tb";
import DayPicker from "../day-picker/DayPicker";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { findTravelSchema } from "@/schema/find-travel.schema";
import { useRouter } from "next/navigation";

interface HeroFindWrapper {
  destinations: Destination[];
}

export default function HeroFindWrapper({ destinations }: HeroFindWrapper) {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(findTravelSchema),
  });
  const route = useRouter();

  const onSubmit = handleSubmit((data) => {
    const query = new URLSearchParams({
      origin: data.origin,
      destination: data.destination,
      checkIn: data.checkIn.toISOString(),
    }).toString();

    route.push(`/reservas?${query}`);
  });

  return (
    <Hero
      image="/banner-hero.png"
      className={{
        container: "h-screen p-0 overflow-visible",
        wrapper: "justify-between px-6",
      }}
    >
      <HeroCaption className="gap-6">
        <HeroTitle className="text-7xl">
          Viaja con <br /> <span className="text-amber-700">Elegancia</span>
        </HeroTitle>
        <HeroDescripcion>
          Redefiniendo el transporte terrestre. Experimenta el máximo confort y
          puntualidad en cada kilómetro de tu trayecto.
        </HeroDescripcion>
      </HeroCaption>

      <form
        className="bg-white w-full p-8 max-w-2xl shadow-2xl rounded-4xl space-y-8"
        onSubmit={onSubmit}
      >
        <p className="font-bold text-2xl">Reserva Tu Viaje</p>

        <div className="grid grid-cols-2 gap-6">
          <Controller
            control={control}
            name="origin"
            render={({ field }) => (
              <Select
                label="ORIGEN"
                placeholder="¿De donde Sales?"
                icon={<LuMapPin />}
                items={destinations.map((i) => ({
                  label: i.name,
                  value: i.slug,
                }))}
                onSelect={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="destination"
            render={({ field }) => (
              <Select
                label="DESTINO"
                placeholder="¿A dónde vas?"
                icon={<TbSend />}
                items={destinations.map((i) => ({
                  label: i.name,
                  value: i.slug,
                }))}
                onSelect={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />

          <Controller
            control={control}
            name="checkIn"
            render={({ field }) => (
              <DayPicker
                icon={<LuCalendar />}
                label="FECHA DE IDA"
                placeholder="mm/dd/yyyy"
                className={{
                  container: "col-span-2",
                }}
                onSelect={(date) => {
                  field.onChange(date);
                }}
                selected={field.value}
              />
            )}
          />

          <button className="py-5 w-full col-span-2 bg-linear-to-r from-amber-700 to-amber-500 text-white font-bold rounded-xl">
            Buscar Viaje
          </button>
        </div>
      </form>
    </Hero>
  );
}
