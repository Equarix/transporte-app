import React, { useState } from "react";
import { SeatSelection } from "@/context/BookingProvider";
import { FaLock } from "react-icons/fa";

interface StepFiveSidebarProps {
  origin: string;
  originTerminal: string;
  destination: string;
  destinationTerminal: string;
  date: string;
  time: string;
  selectedSeats: SeatSelection[];
  serviceCharge: number;
  onPay: () => void;
  isReadyToPay: boolean;
  isPending?: boolean;
}

export default function StepFiveSidebar({
  origin,
  originTerminal,
  destination,
  destinationTerminal,
  date,
  time,
  selectedSeats,
  serviceCharge,
  onPay,
  isReadyToPay,
  isPending,
}: StepFiveSidebarProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const subtotal = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const total = subtotal + serviceCharge;

  return (
    <div className="bg-[#f8f6f4] rounded-4xl p-8 border border-gray-100 flex flex-col h-full sticky top-4">
      <h3 className="text-xl font-bold text-gray-900 mb-8">
        Resumen de Compra
      </h3>

      {/* Route Timeline */}
      <div className="relative pl-6 mb-8">
        <div className="absolute left-1.5 top-2 bottom-2 w-[2px] border-l-2 border-dashed border-[#8b5a2b]/30"></div>

        <div className="mb-6 relative">
          <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-[3px] border-[#8b5a2b] bg-white"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Origen
          </p>
          <p className="text-sm font-black text-gray-900 uppercase">{origin}</p>
          <p className="text-[10px] text-gray-500">{originTerminal}</p>
        </div>

        <div className="relative">
          <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-[#8b5a2b]"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Destino
          </p>
          <p className="text-sm font-black text-gray-900 uppercase">
            {destination}
          </p>
          <p className="text-[10px] text-gray-500">{destinationTerminal}</p>
        </div>
      </div>

      <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Fecha y Hora
          </p>
          <p className="text-sm font-bold text-gray-900">
            {date} — {time}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Asientos
          </p>
          <div className="flex gap-2 justify-end flex-wrap max-w-[120px]">
            {selectedSeats.map((seat) => (
              <span
                key={seat.name}
                className="bg-[#f0e6dc] text-[#8b5a2b] text-[10px] font-bold px-2 py-1 rounded"
              >
                {seat.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Subtotal Pasajes</span>
            <span className="font-bold text-gray-900">
              S/ {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Cargos por Servicio</span>
            <span className="font-bold text-gray-900">
              S/ {serviceCharge.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end pt-4 border-t border-gray-100">
          <span className="font-black text-gray-900">Total a Pagar</span>
          <span className="text-3xl font-black text-[#e87722]">
            S/ {total.toFixed(2)}
          </span>
        </div>
      </div>

      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 text-[#e87722] rounded border-gray-300 focus:ring-[#e87722]"
        />
        <span className="text-[10px] text-gray-500 leading-tight">
          He leído y acepto los{" "}
          <a href="#" className="underline text-[#8b5a2b]">
            Términos y Condiciones
          </a>{" "}
          de uso y la Política de Protección de Datos Personales.
        </span>
      </label>

      <button
        onClick={onPay}
        disabled={!isReadyToPay || !termsAccepted || isPending}
        className="w-full bg-[#e87722] hover:bg-[#d96a1a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 mb-4 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            PAGAR AHORA <span>→</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
        <FaLock />
        <span>Pago 100% Seguro y Encriptado</span>
      </div>
    </div>
  );
}
