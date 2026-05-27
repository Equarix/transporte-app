"use client";
import React from "react";
import { useBooking } from "@/context/BookingProvider";
import { ResposeHotelCercano, Daum } from "@/interface/hotel.interface";
import axios from "axios";
import HotelCard from "../hotel-card/HotelCard";
import { motion } from "motion/react";
import { LuFilter, LuArrowRight } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";

export default function StepTwo() {
  const { response, setHotelSelected, setStep } = useBooking();

  const lat = response?.destination?.lat || "-12.046374";
  const lng = response?.destination?.lng || "-77.042793";
  const distance = 2000;
  const apiUrl = process.env.NEXT_PUBLIC_API_HOTEL || "http://localhost:6060/api";
  const endpoint = `${apiUrl}/hotel/cercanos?lat=${lat}&lng=${lng}&distance=${distance}`;

  const { data: hotels = [], isLoading } = useQuery<Daum[]>({
    queryKey: ["hotels", lat, lng],
    queryFn: async () => {
      const { data } = await axios.get<ResposeHotelCercano>(endpoint);
      return data.data || [];
    },
  });

  const handleSkip = () => {
    setHotelSelected(null);
    setStep(3);
  };

  const handleSelectHotel = (hotel: Daum) => {
    setHotelSelected(hotel);
    setStep(3);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-700 tracking-widest uppercase mb-2 block">
            Cartógrafo de Viajes
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Hoteles Recomendados en {response?.destination?.name || "Lima"}
          </h2>
          <p className="text-gray-500 max-w-2xl">
            Hemos seleccionado las mejores estancias para complementar tu viaje en bus. Confort de lujo y ubicaciones estratégicas.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-5 rounded-full text-sm transition-colors">
            <LuFilter /> Filtrar
          </button>
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-5 rounded-full text-sm transition-colors">
            Precio
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl flex justify-end mb-4">
        <button 
          onClick={handleSkip}
          className="flex items-center gap-2 text-amber-700 font-bold hover:text-amber-800 transition-colors"
        >
          Continuar sin hotel <LuArrowRight />
        </button>
      </div>

      <div className="w-full max-w-5xl space-y-6">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Cargando hoteles...</div>
        ) : hotels.length > 0 ? (
          hotels.map((hotel, index) => (
            <motion.div
              key={hotel.hotelId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <HotelCard hotel={hotel} onSelect={() => handleSelectHotel(hotel)} />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 font-bold">
            No se encontraron hoteles cercanos.
          </div>
        )}
      </div>
    </div>
  );
}
