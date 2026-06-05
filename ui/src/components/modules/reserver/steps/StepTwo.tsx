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
  const { response, setHotelSelected, setStep, reserverSelected } = useBooking();

  const [checkIn, setCheckIn] = React.useState(() => {
    if (reserverSelected?.date) {
      return reserverSelected.date.split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  });

  const [checkOut, setCheckOut] = React.useState(() => {
    const baseDate = reserverSelected?.date ? new Date(reserverSelected.date) : new Date();
    baseDate.setDate(baseDate.getDate() + 1);
    return baseDate.toISOString().split("T")[0];
  });

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    if (new Date(checkOut) <= new Date(val)) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split("T")[0]);
    }
  };

  const handleCheckOutChange = (val: string) => {
    if (new Date(val) <= new Date(checkIn)) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split("T")[0]);
    } else {
      setCheckOut(val);
    }
  };

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
    // Calculate nights for hotel
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    setHotelSelected({
      ...hotel,
      nights,
      checkIn: checkIn,
      checkOut: checkOut,
    });
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

      {/* Date Pickers Container */}
      <div className="w-full max-w-5xl bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto flex-1">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Fecha de Entrada (Check-in)
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Fecha de Salida (Check-out)
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all"
            />
          </div>
        </div>
        <div className="text-right shrink-0 mt-4 md:mt-0">
          <span className="text-xs font-bold text-amber-700 block mb-1">
            Fechas de Estancia
          </span>
          <span className="text-sm font-black text-gray-900">
            {checkIn} hasta {checkOut}
          </span>
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
