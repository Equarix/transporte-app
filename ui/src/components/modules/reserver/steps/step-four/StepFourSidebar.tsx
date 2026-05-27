import React from "react";
import { SeatSelection } from "@/context/BookingProvider";
import { MdHelp } from "react-icons/md";

interface StepFourSidebarProps {
  origin: string;
  destination: string;
  date: string;
  time: string;
  selectedSeats: SeatSelection[];
  discount?: number;
}

export default function StepFourSidebar({
  origin,
  destination,
  date,
  time,
  selectedSeats,
  discount = 10.0,
}: StepFourSidebarProps) {
  const basePrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const total = basePrice - discount;

  return (
    <div className="flex flex-col h-full sticky top-4 gap-6">
      <div className="bg-white rounded-4xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col">
        {/* Header with image background */}
        <div
          className="relative h-48 bg-gray-900 px-8 py-6 flex flex-col justify-end"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/80 to-transparent"></div>

          <div className="relative z-10">
            <span className="inline-block bg-[#e87722] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
              Confirmado
            </span>
            <h3 className="text-2xl font-black text-gray-900">Tu Viaje</h3>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-8">
          {/* Trip Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Ruta
              </span>
              <span className="font-bold text-gray-800 uppercase">
                {origin} <span className="text-gray-400 mx-1">→</span>{" "}
                {destination}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Fecha
              </span>
              <span className="font-bold text-gray-800">{date}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Hora
              </span>
              <span className="font-bold text-gray-800">{time}</span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-[#f8f6f4] rounded-2xl p-6">
            <div className="space-y-3 mb-6">
              {selectedSeats.map((seat) => (
                <div
                  key={`${seat.floor}-${seat.name}`}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-500">
                    Asiento {seat.name} (General)
                  </span>
                  <span className="font-bold text-gray-900">
                    S/ {seat.price.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8b5a2b] flex items-center gap-2">
                  <span>🎟️</span> Promo Editorial
                </span>
                <span className="font-bold text-[#8b5a2b]">
                  - S/ {discount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-4 border-t border-gray-200">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Total a Pagar
                </p>
                <span className="text-3xl font-black text-gray-900">
                  S/ {total.toFixed(2)}
                </span>
              </div>
              <div className="w-12 h-10 bg-[#e87722]/10 rounded-xl flex items-center justify-center text-[#e87722] text-xl">
                💵
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Footer */}
      <div className="flex items-start gap-3 px-4">
        <MdHelp className="text-gray-400 text-xl shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          ¿Necesitas ayuda con el registro? Llámanos al{" "}
          <span className="font-bold text-[#8b5a2b]">0-800-VELOCITY</span>
        </p>
      </div>
    </div>
  );
}
