import Card from "@/components/ui/card/Card";
import CardImage from "@/components/ui/card/CardImage";
import Hero from "@/components/ui/hero/Hero";
import HeroCaption from "@/components/ui/hero/HeroCaption";
import HeroDescripcion from "@/components/ui/hero/HeroDescripcion";
import HeroTitle from "@/components/ui/hero/HeroTitle";
import { instance } from "@/config/axios";
import { ENV } from "@/config/ENV";
import { ResponseAgency } from "@/interface/response.interface";
import { ApiResponse } from "@/interface/utils.interface";
import { errorWrapper } from "@/utils/errorWrapper";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function AgencyPage() {
  const [error, data] = await errorWrapper(async () => {
    const res =
      await instance.get<ApiResponse<ResponseAgency[]>>("/public/agency");
    return res.data;
  });

  if (error) {
    return notFound();
  }

  return (
    <main className="space-y-4">
      <Hero image="/modules/agency/hero.png">
        <HeroCaption>
          <HeroTitle>
            Nuestras <span className="text-amber-700">Agencias</span>
          </HeroTitle>
          <HeroDescripcion>
            Estamos donde tú estés. Encuentra tu punto de partida más cercano
            con la seguridad y confianza que solo Ittsabus te ofrece en cada
            kilómetro.
          </HeroDescripcion>
        </HeroCaption>
      </Hero>
      <section className="grid-cols-4 grid gap-8">
        <article className="col-span-3 grid grid-cols-2 gap-4">
          {data?.body.map((i) => {
            console.log(ENV.API_URL + i.galery.imageUrl);
            return (
              <Card key={i.agencyId}>
                <CardImage src={ENV.API_URL + i.galery.imageUrl} />
              </Card>
            );
          })}
        </article>
      </section>
      <Image
        src="http://localhost:5000/api/static/1776034749702-images.jpg"
        width={500}
        height={300}
        alt="imagen"
      />
    </main>
  );
}
