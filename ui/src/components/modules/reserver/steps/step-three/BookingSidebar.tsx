import React from "react";
import { LuCalendar, LuArmchair } from "react-icons/lu";
import { SeatSelection } from "@/context/BookingProvider";

interface BookingSidebarProps {
  origin: string;
  destination: string;
  date: string;
  selectedSeats: SeatSelection[];
  serviceCharge: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function BookingSidebar({
  origin,
  destination,
  date,
  selectedSeats,
  serviceCharge,
  onNext,
  onPrev,
}: BookingSidebarProps) {
  const basePrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const total = basePrice + (selectedSeats.length > 0 ? serviceCharge : 0);

  return (
    <div className="bg-white rounded-4xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full sticky top-4">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Tu Viaje</h3>

      {/* Route */}
      <div className="relative pl-6 mb-8">
        <div className="absolute left-1.5 top-2 bottom-2 w-[2px] bg-gray-200"></div>

        <div className="mb-6 relative">
          <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#e87722] ring-4 ring-white"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Origen
          </p>
          <p className="text-sm font-bold text-gray-800">{origin}</p>
        </div>

        <div className="relative">
          <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Destino
          </p>
          <p className="text-sm font-bold text-gray-800">{destination}</p>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-3 text-gray-600 mb-8 pb-8 border-b border-gray-100">
        <LuCalendar className="text-xl text-gray-400" />
        <span className="font-medium text-sm">{date}</span>
      </div>

      {/* Selected Seats */}
      <div className="flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
          Asientos Seleccionados
        </p>

        {selectedSeats.length === 0 ? (
          <p className="text-sm text-gray-400 mb-6 italic">
            No has seleccionado asientos
          </p>
        ) : (
          <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto pr-2">
            {selectedSeats.map((seat) => (
              <div
                key={`${seat.floor}-${seat.name}`}
                className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <LuArmchair className="text-[#e87722] text-xl" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Piso {seat.floor} - Asiento {seat.name}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase">
                      {seat.type}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#8b5a2b]">
                  S/ {seat.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Precio Base</span>
          <span className="font-bold text-gray-900">
            S/ {basePrice.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Cargo de Servicio</span>
          <span className="font-bold text-gray-900">
            S/ {selectedSeats.length > 0 ? serviceCharge.toFixed(2) : "0.00"}
          </span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-xl font-black text-gray-900">Total</span>
          <span className="text-xl font-black text-[#603314]">
            S/ {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          disabled={selectedSeats.length === 0}
          onClick={onNext}
          className="w-full bg-[#e87722] hover:bg-[#d96a1a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20"
        >
          Siguiente
        </button>
        <button
          onClick={onPrev}
          className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-4 rounded-xl transition-all"
        >
          Anterior
        </button>
      </div>
    </div>
  );
}
