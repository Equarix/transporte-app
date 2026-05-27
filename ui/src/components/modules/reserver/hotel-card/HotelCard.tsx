import React from "react";
import { Daum } from "@/interface/hotel.interface";
import { LuMapPin, LuWifi, LuCoffee, LuCar, LuWaves } from "react-icons/lu";

interface HotelCardProps {
  hotel: Daum;
  onSelect: () => void;
}

export default function HotelCard({ hotel, onSelect }: HotelCardProps) {
  const imageUrl = `${process.env.NEXT_PUBLIC_API_HOTEL_IMAGES}/images/${hotel.image_name}.webp`;

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-6 shadow-sm border border-gray-100 w-full hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full md:w-80 h-56 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
        <img
          src={imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400/eeeeee/999999?text=Hotel";
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 justify-between py-2">
        <div>
          <div className="flex items-center gap-1 text-amber-500 mb-1">
            {/* Mock stars */}
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {hotel.name}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <LuMapPin className="mr-1" />
            <span>{hotel.location}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              <LuWifi className="text-amber-600" /> Free WiFi
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              <LuWaves className="text-amber-600" /> Pool
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              <LuCoffee className="text-amber-600" /> Breakfast
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              <LuCar className="text-amber-600" /> Parking
            </div>
          </div>
        </div>

        {/* Action & Price for Mobile */}
        <div className="md:hidden flex flex-col mt-6">
          <div className="flex flex-col mb-4">
            <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">
              Desde por noche
            </span>
            <span className="text-2xl font-black text-amber-700">
              S/ {hotel.price_per_night.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onSelect}
            className="bg-[#d97706] hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-amber-700/20"
          >
            Seleccionar
          </button>
        </div>
      </div>

      {/* Price & Action for Desktop */}
      <div className="hidden md:flex flex-col items-end justify-between py-2 min-w-[180px]">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase">
            Desde por noche
          </span>
          <span className="text-3xl font-black text-amber-700">
            S/ {hotel.price_per_night.toFixed(2)}
          </span>
        </div>
        <button
          onClick={onSelect}
          className="bg-[#d97706] hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-lg shadow-amber-700/20 active:scale-95"
        >
          Seleccionar
        </button>
      </div>
    </div>
  );
}
