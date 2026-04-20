import Card from "@/components/ui/card/Card";
import CardBody from "@/components/ui/card/CardBody";
import CardImage from "@/components/ui/card/CardImage";
import CardTitle from "@/components/ui/card/CardTitle";
import Hero from "@/components/ui/hero/Hero";
import HeroCaption from "@/components/ui/hero/HeroCaption";
import HeroDescripcion from "@/components/ui/hero/HeroDescripcion";
import HeroTitle from "@/components/ui/hero/HeroTitle";
import Typography from "@/components/ui/typography/Typography";
import { instance } from "@/config/axios";
import { ENV } from "@/config/ENV";
import { ResponseAgency } from "@/interface/response.interface";
import { ApiResponse } from "@/interface/utils.interface";
import { errorWrapper } from "@/utils/errorWrapper";
import { notFound } from "next/navigation";
import { LuPhone } from "react-icons/lu";
import { HiOutlineLocationMarker } from "react-icons/hi";
import CardFooter from "@/components/ui/card/CardFooter";
import Link from "next/link";
import MapHome from "@/components/modules/angency/MapHome";

export default async function AgencyPage() {
  const [error, data] = await errorWrapper(async () => {
    const res =
      await instance.get<ApiResponse<ResponseAgency[]>>("/public/agency");
    return res.data;
  });

  if (error) {
    console.log(error);
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
      <section className="grid-cols-5 grid gap-8 px-8">
        <article className="col-span-3 grid grid-cols-2 gap-4">
          {data?.body.map((i) => {
            return (
              <Card key={i.agencyId}>
                <CardImage src={ENV.API_URL + i.galery.imageUrl} />
                <CardBody>
                  <CardTitle>{i.name}</CardTitle>
                  <Typography
                    startContent={
                      <HiOutlineLocationMarker className="text-orange-500 text-xl" />
                    }
                  >
                    {i.address}
                  </Typography>
                  <Typography
                    className="font-bold"
                    startContent={
                      <LuPhone className="text-orange-500 text-xl" />
                    }
                  >
                    {i.phone}
                  </Typography>
                </CardBody>
                <CardFooter>
                  <Link
                    className="bg-orange-500 text-white p-3 rounded-4xl text-center"
                    href={`/agencias/${i.slug}`}
                  >
                    Ver más
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </article>

        <article className="col-span-2 sticky top-24 h-fit">
          <MapHome agency={data!.body} />
        </article>
      </section>
    </main>
  );
}
