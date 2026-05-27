import { HeroFind } from "@/components/ui/hero-find/HeroFind";
import MapRoutesHome from "@/components/modules/home/MapRoutesHome";
import { ResponseMapa } from "@/interface/response.interface";
import { ENV } from "@/config/ENV";
import MapProvider from "@/components/context/map-context/MapContext";

async function getMapRoutes(): Promise<ResponseMapa[]> {
  try {
    const res = await fetch(
      "http://localhost:5000/api/public/destination/mapa",
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.body || data || [];
  } catch (error) {
    console.error("Error fetching map routes", error);
    return [];
  }
}

export default async function Home() {
  const routes = await getMapRoutes();

  return (
    <main>
      <HeroFind />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Rutas <span className="text-[#e87722]">Frecuentes</span>
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Conoce los destinos que más visitan nuestros pasajeros
          </p>
        </div>
        <MapProvider apiKey={ENV.GOOGLE_MAPS_API_KEY!}>
          <MapRoutesHome routes={routes} />
        </MapProvider>
      </section>
    </main>
  );
}
