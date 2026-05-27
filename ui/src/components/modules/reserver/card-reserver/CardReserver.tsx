import React from "react";
import { LuArmchair, LuWifi, LuSnowflake, LuTv, LuDog } from "react-icons/lu";

interface CardReserverProps {
  reserver: any;
  onSelect: () => void;
}

export default function CardReserver({ reserver, onSelect }: CardReserverProps) {
  // Extract info from reserver if available, else mock for visual parity
  const departureTime = reserver?.reserverAgencies?.[0]?.hour?.substring(0, 5) || "08:00";
  const arrivalTime = reserver?.checkOutHour?.substring(0, 5) || "17:00";
  // Fallbacks in case the API response doesn't have these exact nested fields
  const serviceName = reserver?.bus?.model || "SOFA CAMA 160";
  const availability = reserver?.bus?.capacity || 11;
  const price = reserver?.reserverPriceFloors?.[0]?.price || 80.00;

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col xl:flex-row items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4 w-full border border-gray-100">
      {/* Time Section */}
      <div className="flex items-center space-x-6 min-w-[240px]">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold text-gray-900">{departureTime}</span>
          <span className="text-[10px] font-bold text-gray-400 tracking-widest mt-1 uppercase">Salida</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-px bg-amber-700/30"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-700 mx-1"></div>
          <div className="w-12 h-px bg-amber-700/30"></div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-3xl font-extrabold text-gray-900">{arrivalTime}</span>
          <span className="text-[10px] font-bold text-gray-400 tracking-widest mt-1 uppercase">Llegada</span>
        </div>
      </div>

      <div className="hidden xl:block w-px h-16 bg-gray-100 mx-6"></div>

      {/* Info Section */}
      <div className="flex-1 flex flex-wrap gap-6 items-center justify-between px-4 w-full mt-6 xl:mt-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-amber-700 tracking-wider mb-1 uppercase">Servicio</span>
          <span className="text-sm font-extrabold text-gray-800 uppercase">{serviceName}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-amber-700 tracking-wider mb-1 uppercase">Disponibilidad</span>
          <div className="flex items-center text-sm font-bold text-gray-700 gap-1.5">
            <LuArmchair className="text-emerald-500 text-lg" />
            <span>{availability} Libres</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-amber-700 tracking-wider mb-1 uppercase">Comodidades</span>
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1.5 rounded-md text-gray-500"><LuDog size={16} /></div>
            <div className="bg-gray-100 p-1.5 rounded-md text-gray-500"><LuWifi size={16} /></div>
            <div className="bg-gray-100 p-1.5 rounded-md text-gray-500"><LuSnowflake size={16} /></div>
            <div className="bg-gray-100 p-1.5 rounded-md text-gray-500"><LuTv size={16} /></div>
          </div>
        </div>
      </div>

      {/* Price & Action Section */}
      <div className="bg-[#efedeb] rounded-2xl p-5 flex flex-col items-center min-w-[160px] mt-6 xl:mt-0 ml-0 xl:ml-4">
        <span className="text-[10px] font-bold text-gray-400 tracking-wide uppercase mb-1">Desde</span>
        <span className="text-2xl font-black text-gray-800 mb-3 whitespace-nowrap">
          S/ {price.toFixed(2)}
        </span>
        <button 
          onClick={onSelect}
          className="bg-[#d97706] hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all w-full shadow-lg shadow-amber-700/20 hover:shadow-amber-700/40 active:scale-95"
        >
          Seleccionar
        </button>
      </div>
    </div>
  );
}
