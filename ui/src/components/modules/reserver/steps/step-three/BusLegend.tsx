import React from "react";
import { LuPawPrint } from "react-icons/lu";

export default function BusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-6 bg-gray-50 p-4 rounded-2xl w-fit">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-white border border-gray-100 shadow-sm"></div>
        <span className="text-xs font-bold text-gray-500">Libres</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#e87722]"></div>
        <span className="text-xs font-bold text-gray-500">Seleccionado</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gray-300"></div>
        <span className="text-xs font-bold text-gray-500">Vendido</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#f27166]"></div>
        <span className="text-xs font-bold text-gray-500">Reservado</span>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <div className="w-6 h-6 rounded-md border border-dashed border-[#8b5a2b] flex items-center justify-center">
          <LuPawPrint className="text-[#8b5a2b] text-[10px]" />
        </div>
        <span className="text-xs font-bold text-gray-500">Pet Friendly</span>
      </div>
    </div>
  );
}
