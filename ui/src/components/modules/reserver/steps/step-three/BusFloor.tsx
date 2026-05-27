import React from "react";
import { LuArmchair } from "react-icons/lu";

interface BusFloorProps {
  floorNumber: number;
  name: string;
  children: React.ReactNode;
}

export default function BusFloor({ floorNumber, name, children }: BusFloorProps) {
  return (
    <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col items-center min-w-[280px]">
      {/* Watermark */}
      <div className="absolute right-4 top-4 text-gray-200 font-black text-8xl opacity-50 pointer-events-none select-none">
        0{floorNumber}
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-8 self-start z-10 relative">
        <LuArmchair className="text-[#e87722] text-xl" />
        <h3 className="text-xl font-bold text-gray-900">
          Piso {floorNumber}: <span className="text-gray-700">{name}</span>
        </h3>
      </div>

      {/* Bus Steering Wheel / Front indicator */}
      <div className="mb-6 opacity-30">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 12l4-4M12 12l-4-4M12 12v6" />
        </svg>
      </div>

      {/* Seats Container */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 z-10 relative">
        {children}
      </div>

      {/* Front of bus indicator */}
      <div className="mt-8 text-center w-full z-10 relative">
        <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
          Frente del Bus
        </p>
      </div>
    </div>
  );
}
