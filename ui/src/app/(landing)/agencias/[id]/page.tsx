import Badge from "@/components/ui/badge/Badge";
import Hero from "@/components/ui/hero/Hero";
import HeroCaption from "@/components/ui/hero/HeroCaption";
import HeroDescripcion from "@/components/ui/hero/HeroDescripcion";
import HeroTitle from "@/components/ui/hero/HeroTitle";
import { instance } from "@/config/axios";
import { ENV } from "@/config/ENV";
import { ResponseAgency } from "@/interface/response.interface";
import { ApiResponse } from "@/interface/utils.interface";
import { errorWrapper } from "@/utils/errorWrapper";
import { notFound } from "next/navigation";
import { LuClock, LuMapPin, LuPhone } from "react-icons/lu";
import MapDetails from "@/components/modules/angency/MapDetails";
import * as Lu from "react-icons/lu";
import Icon from "@/components/ui/icon/Icon";

export default async function DetailAgency({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [error, data] = await errorWrapper(async () => {
    const res = await instance.get<ApiResponse<ResponseAgency>>(
      `/public/agency/${id}`,
    );
    return res.data;
  });

  if (error) {
    return notFound();
  }

  const agency = data!.body;

  const [name, ...largeAddress] = agency.name.split(" ");
  const joinLarge = largeAddress.join(" ");

  return (
    <main className="space-y-4 mb-6">
      <Hero
        image={ENV.API_URL + agency.galery.imageUrl}
        className={{
          imagebg: "opacity-100 blur-xs",
          container: "px-8",
        }}
      >
        <HeroCaption className="max-w-[672px]">
          <Badge>NUESTRAS SEDES</Badge>
          <HeroTitle className="text-white">
            {name} <span className="text-orange-500">{joinLarge}</span>
          </HeroTitle>
          <HeroDescripcion className="text-white">
            {agency.description}
          </HeroDescripcion>
        </HeroCaption>
      </Hero>

      <section className="grid grid-cols-12 gap-12 px-8 py-8">
        <article className="col-span-8 bg-white p-12 rounded-4xl shadow-2xl shadow-slate-100 flex flex-col gap-10">
          <header className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-800">
              Información de Contacto
            </h2>
            <div className="h-1.5 w-20 bg-orange-500 rounded-full mt-1" />
          </header>

          <div className="grid grid-cols-2 gap-x-12 gap-y-10">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                <LuMapPin size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Dirección
                </p>
                <h4 className="font-bold text-slate-700 text-lg leading-tight">
                  {agency.address}
                </h4>
                <p className="text-sm text-slate-500">{agency.largeAddress}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                <LuPhone size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Teléfono
                </p>
                <h4 className="font-bold text-slate-700 text-lg leading-tight">
                  {agency.phone}
                </h4>
                <p className="text-sm text-slate-500">Atención 24/7</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                <LuClock size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Horarios
                </p>
                <h4 className="font-bold text-slate-700 text-lg leading-tight">
                  Lun - Dom
                </h4>
                <p className="text-sm text-slate-500">06:00 AM - 11:30 PM</p>
              </div>
            </div>
          </div>
        </article>

        <MapDetails agency={agency} />
      </section>

      <section className="space-y-12 px-8">
        <header className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">
            Servicios Disponibles
          </h2>
          <p>Comodidades y facilidades exclusivas en nuestra sede.</p>
        </header>

        <div className="w-full grid-cols-4 grid gap-6">
          {agency.services.map((s) => {
            const IconRender = Lu[s.icon as keyof typeof Lu];

            return (
              <article className="w-full min-h-[180px] flex flex-col justify-center items-center space-y-6 bg-white shadow rounded-3xl">
                <Icon className="size-16 rounded-full bg-orange-100 text-orange-800">
                  <IconRender />
                </Icon>
                <p className="font-bold">{s.name}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-12 px-8 py-32">
        <header className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">
            Proximas Saldias (PENDIENTE A API)
          </h2>
          <p>Comodidades y facilidades exclusivas en nuestra sede.</p>
        </header>{" "}
      </section>
    </main>
  );
}
