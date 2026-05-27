import React from "react";
import Link from "next/link";
import { FaCheckCircle, FaDownload, FaBus } from "react-icons/fa";

export default function ReservationCompletedPage() {
  return (
    <div className="min-h-screen bg-[#f8f6f4] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fdf5f0] to-white z-0"></div>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#e87722]/5 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            ¡Viaje <span className="text-[#8b5a2b]">Confirmado!</span>
          </h1>
          <p className="text-gray-500 max-w-lg mb-10 text-lg">
            Tu pago ha sido procesado con éxito. Hemos enviado los detalles de
            tu boleto a tu correo electrónico.
          </p>

          {/* Ticket Summary Card */}
          <div className="w-full bg-[#f8f6f4] rounded-3xl p-6 md:p-8 text-left border border-gray-100 mb-10 relative">
            {/* Cutouts for ticket effect */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-r border-gray-100"></div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-l border-gray-100"></div>
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-200"></div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#8b5a2b]/10 flex items-center justify-center text-[#8b5a2b]">
                <FaBus />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Código de Reserva
                </p>
                <p className="font-black text-gray-900 tracking-wider">
                  KNTX-9082A
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10 pb-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Origen
                </p>
                <p className="font-bold text-gray-900">TRUJILLO</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Destino
                </p>
                <p className="font-bold text-gray-900">LIMA</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Fecha
                </p>
                <p className="font-bold text-gray-900">15 Oct, 2023</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Hora
                </p>
                <p className="font-bold text-gray-900">21:45 PM</p>
              </div>
            </div>

            <div className="pt-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Pasajeros
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                  Asiento 24-A
                </span>
                <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
                  Asiento 24-B
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button className="flex-1 bg-white border-2 border-gray-100 hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2">
              <FaDownload className="text-gray-400" />
              DESCARGAR BOLETO
            </button>
            <Link href="/" className="flex-1">
              <button className="w-full bg-[#e87722] hover:bg-[#d96a1a] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                VOLVER AL INICIO
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
