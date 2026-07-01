import { HeroFind } from "@/components/ui/hero-find/HeroFind";
import MapRoutesHome from "@/components/modules/home/MapRoutesHome";
import { ResponseMapa } from "@/interface/response.interface";
import { ENV } from "@/config/ENV";
import MapProvider from "@/components/context/map-context/MapContext";
import { LuStar, LuCompass, LuMapPin } from "react-icons/lu";

interface TouristReviewData {
  destinationId: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  lat: string;
  lng: string;
  galery?: {
    imageUrl: string;
    imageName: string;
  };
  experiences: {
    experienceId: number;
    name: string;
    description: string;
    type: string;
  }[];
  metrics: {
    avgComfort: number;
    avgPunctuality: number;
    avgService: number;
    avgDriver: number;
    avgOverall: number;
  };
  reviews: {
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const API_URL = ENV.API_URL || "http://localhost:5000/api";

async function getMapRoutes(): Promise<ResponseMapa[]> {
  try {
    const res = await fetch(
      `${API_URL}/public/destination/mapa`,
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

async function getTouristReviews(): Promise<TouristReviewData[]> {
  try {
    const res = await fetch(
      `${API_URL}/public/destination/tourist-reviews`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.body || data || [];
  } catch (error) {
    console.error("Error fetching tourist reviews", error);
    return [];
  }
}

import LiveTrackingWidget from "@/components/modules/home/LiveTrackingWidget";
import PromoAlertWidget from "@/components/modules/home/PromoAlertWidget";

export default async function Home() {
  const routes = await getMapRoutes();
  const touristData = await getTouristReviews();

  return (
    <main>
      <HeroFind />
      
      {/* Rutas Frecuentes */}
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

      {/* Servicios Inteligentes y de IA en Tiempo Real */}
      <section className="bg-gray-50/50 border-t border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Servicios <span className="text-[#e87722]">Inteligentes y de IA</span>
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Prueba nuestras nuevas herramientas de rastreo satelital activo y alertas automatizadas de ofertas.
            </p>
          </div>

          <LiveTrackingWidget />
          <PromoAlertWidget />
        </div>
      </section>

      {/* Seccion de Reseñas y Turismo */}
      {touristData && touristData.length > 0 && (
        <section className="bg-gradient-to-b from-amber-50/10 to-[#fdfcfb] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Experiencias y <span className="text-[#e87722]">Reseñas Turísticas</span>
              </h2>
              <p className="text-gray-500 mt-2 text-lg">
                Descubre qué opinan nuestros viajeros y los mejores lugares para visitar en cada destino
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {touristData.map((dest) => (
                <div
                  key={dest.destinationId}
                  className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 flex flex-col gap-6"
                >
                  {/* Destination Header */}
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Destino Seguro
                      </span>
                      <h3 className="text-2xl font-black text-gray-900 mt-2 flex items-center gap-2">
                        <LuMapPin className="text-[#e87722]" />
                        {dest.name}
                      </h3>
                    </div>
                    {/* Overall Rating Badge */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-center shrink-0">
                      <p className="text-2xl font-black text-amber-900 leading-none">
                        {dest.metrics.avgOverall}
                      </p>
                      <div className="flex gap-0.5 mt-1 text-amber-600 justify-center">
                        <LuStar size={12} className="fill-amber-500 text-amber-500" />
                        <span className="text-[9px] font-bold text-gray-500 ml-1">/ 5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Grid: Tourist Places & Ratings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tourist Info Column */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                        <LuCompass /> Qué Visitar
                      </h4>
                      {dest.experiences && dest.experiences.length > 0 ? (
                        <div className="space-y-3">
                          {dest.experiences.map((exp) => (
                            <div
                              key={exp.experienceId}
                              className="bg-gray-50/50 hover:bg-amber-50/30 border border-gray-100 rounded-2xl p-4 transition-all duration-200"
                            >
                              <h5 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#e87722]" />
                                {exp.name}
                              </h5>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">
                          Próximamente más información de este destino.
                        </p>
                      )}
                    </div>

                    {/* Ratings & Metrics Column */}
                    <div className="space-y-4 bg-gray-50/40 border border-gray-100/70 rounded-3xl p-5">
                      <h4 className="text-xs font-bold text-[#5D4037] uppercase tracking-widest flex items-center gap-1.5">
                        <LuStar /> Valoración Detallada
                      </h4>
                      <div className="space-y-3 pt-1">
                        <RatingBar label="Confort" value={dest.metrics.avgComfort} />
                        <RatingBar label="Puntualidad" value={dest.metrics.avgPunctuality} />
                        <RatingBar label="Servicio a Bordo" value={dest.metrics.avgService} />
                        <RatingBar label="Conductor" value={dest.metrics.avgDriver} />
                      </div>
                    </div>
                  </div>

                  {/* Passenger Reviews Slider/Testimonials */}
                  <div className="border-t border-gray-100 pt-5 mt-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Opiniones de Pasajeros
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {dest.reviews.slice(0, 2).map((rev, idx) => (
                        <div
                          key={idx}
                          className="bg-linear-to-r from-amber-50/10 to-transparent border-l-2 border-amber-500 pl-4 py-1"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-gray-800">{rev.author}</p>
                            <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
                          </div>
                          <p className="text-xs italic text-gray-600 mt-1.5 font-medium leading-relaxed">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const percent = (value / 5) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold text-gray-700">
        <span>{label}</span>
        <span className="text-amber-800">{value} ★</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
