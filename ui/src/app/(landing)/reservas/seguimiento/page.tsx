"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/config/axios";
import { ApiResponse } from "@/interface/utils.interface";
import {
  LuBus,
  LuUser,
  LuCompass,
  LuClock,
  LuMapPin,
  LuWifi,
  LuUsb,
  LuWind,
  LuCoffee,
  LuChevronLeft,
  LuLoader,
  LuNavigation,
} from "react-icons/lu";

interface TrackingData {
  reserverId: number;
  status: string;
  date: string;
  checkOutHour: string;
  bus: {
    plate: string;
    model: string;
    type: string;
    capacity: number;
  };
  driver: {
    firstName: string;
    lastName: string;
  };
  origin: {
    name: string;
    lat: number;
    lng: number;
  };
  destination: {
    name: string;
    lat: number;
    lng: number;
  };
  currentLocation: {
    lat: number;
    lng: number;
    progressPercentage: number;
  };
  eta: {
    minutesRemaining: number;
    estimatedTimeOfArrival: string;
  };
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const { data: trackingResponse, isLoading, error } = useQuery<ApiResponse<TrackingData>>({
    queryKey: ["tracking", id],
    queryFn: async () => {
      const res = await instance.get<ApiResponse<TrackingData>>(`/tracking/${id}`);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: 5000, // Auto-refresh every 5 seconds to simulate real-time coordinates!
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] pt-28 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LuLoader className="animate-spin text-[#e87722] text-4xl mx-auto" />
          <p className="text-[#5D4037] font-semibold text-sm">Conectando con el GPS del autobús...</p>
        </div>
      </div>
    );
  }

  if (error || !trackingResponse?.body) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] pt-28 pb-16 px-4 max-w-xl mx-auto text-center space-y-6">
        <div className="size-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto border border-red-100">
          <LuCompass size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Seguimiento no disponible</h2>
          <p className="text-sm text-gray-500 mt-2">
            No se pudo establecer conexión con el sistema de rastreo en tiempo real para este viaje. Verifica el ID de reserva.
          </p>
        </div>
        <button
          onClick={() => router.push("/perfil?tab=tickets")}
          className="px-6 py-2.5 bg-[#5D4037] text-white font-bold rounded-xl text-xs hover:bg-[#4E342E]"
        >
          Volver a Mis Reservas
        </button>
      </div>
    );
  }

  const track = trackingResponse.body;
  const progress = track.currentLocation.progressPercentage;

  return (
    <div className="w-full min-h-screen bg-[#fdfcfb] pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header back button */}
      <button
        onClick={() => router.push("/perfil?tab=tickets")}
        className="flex items-center gap-2 text-[#5D4037] hover:text-[#e87722] transition-colors font-bold text-sm"
      >
        <LuChevronLeft size={18} /> Volver a mi perfil
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Trip Details Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-6">
            
            {/* Status & Trip Title */}
            <div className="border-b border-gray-50 pb-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                En Ruta
              </span>
              <h2 className="text-lg font-black text-gray-800 mt-3 leading-tight">
                Ruta: {track.origin.name.split(" ")[0]} → {track.destination.name.split(" ")[0]}
              </h2>
              <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wide">
                Reserva: IT-{track.reserverId}
              </p>
            </div>

            {/* Bus Info */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
                <LuBus size={22} />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Autobús</h3>
                <p className="font-extrabold text-gray-800 text-sm mt-1">{track.bus.plate} - {track.bus.model}</p>
                <p className="text-xs text-gray-500 mt-0.5">{track.bus.type}</p>
              </div>
            </div>

            {/* Driver Info */}
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-700">
                <LuUser size={22} />
              </div>
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Conductor</h3>
                <p className="font-extrabold text-gray-800 text-sm mt-1">
                  {track.driver.firstName} {track.driver.lastName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Piloto Principal Autorizado</p>
              </div>
            </div>

            {/* ETA details */}
            <div className="bg-linear-to-br from-amber-50 to-[#fffbf7] border border-amber-100 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Tiempo Estimado</h4>
                  <p className="text-2xl font-black text-amber-950">
                    {track.eta.minutesRemaining} min
                  </p>
                </div>
                <LuClock className="text-amber-700 text-3xl animate-pulse" />
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>{progress}% Recorrido</span>
                <span>ETA: {new Date(track.eta.estimatedTimeOfArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Services Available */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Servicios a Bordo</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <LuWifi className="text-amber-700" size={16} />
                  <span className="text-xs font-bold text-gray-700">WiFi 5G</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <LuUsb className="text-amber-700" size={16} />
                  <span className="text-xs font-bold text-gray-700">Puertos USB</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <LuWind className="text-amber-700" size={16} />
                  <span className="text-xs font-bold text-gray-700">Aire Acond.</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                  <LuCoffee className="text-amber-700" size={16} />
                  <span className="text-xs font-bold text-gray-700">Snacks</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Visual GPS Simulation Map */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs flex flex-col h-full min-h-[500px]">
            <div className="mb-4">
              <span className="text-xs font-black text-[#e87722] bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Mapa en vivo
              </span>
              <h2 className="text-xl font-black text-gray-800 mt-2">Seguimiento Satelital</h2>
            </div>
            
            {/* Live GPS simulated track using interactive premium design */}
            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center p-8">
              
              {/* Grid Background visual styling */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
              
              {/* Route Line */}
              <div className="w-4/5 h-1.5 bg-gray-250 rounded-full relative z-10">
                
                {/* Travelled line */}
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />

                {/* Origin Marker */}
                <div className="absolute -left-3 -top-3.5 z-20 flex flex-col items-center">
                  <div className="size-8 rounded-full bg-[#5D4037] border-4 border-white shadow-md flex items-center justify-center text-white">
                    <LuMapPin size={14} />
                  </div>
                  <span className="text-[10px] font-black text-[#5D4037] bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-xs mt-2 truncate max-w-[100px]">
                    {track.origin.name.split(" ")[0]}
                  </span>
                </div>

                {/* Destination Marker */}
                <div className="absolute -right-3 -top-3.5 z-20 flex flex-col items-center">
                  <div className="size-8 rounded-full bg-amber-600 border-4 border-white shadow-md flex items-center justify-center text-white">
                    <LuMapPin size={14} />
                  </div>
                  <span className="text-[10px] font-black text-amber-700 bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-xs mt-2 truncate max-w-[100px]">
                    {track.destination.name.split(" ")[0]}
                  </span>
                </div>

                {/* Live Bus Moving Marker */}
                <div
                  className="absolute -top-6 z-30 transition-all duration-1000 flex flex-col items-center"
                  style={{ left: `calc(${progress}% - 16px)` }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 size-8 rounded-full bg-amber-500 animate-ping opacity-30" />
                    <div className="size-8 rounded-full bg-[#e87722] border-2 border-white shadow-lg flex items-center justify-center text-white relative z-10">
                      <LuNavigation className="rotate-90 animate-bounce" size={14} />
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-white bg-[#e87722] px-2 py-0.5 rounded-full shadow-sm mt-1.5 whitespace-nowrap">
                    {track.bus.plate} ({progress}%)
                  </span>
                </div>

              </div>

              {/* Status footer inside map */}
              <div className="absolute bottom-6 bg-white/95 backdrop-blur-xs border border-gray-100 rounded-2xl p-4 shadow-md max-w-sm w-11/12 z-20 flex items-center gap-4">
                <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <LuNavigation size={18} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800">Ubicación del Autobús</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Latitud: {track.currentLocation.lat.toFixed(5)} | Longitud: {track.currentLocation.lng.toFixed(5)}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#fdfcfb] pt-28 pb-16 flex items-center justify-center">
          <div className="text-center space-y-4">
            <LuLoader className="animate-spin text-[#e87722] text-4xl mx-auto" />
            <p className="text-[#5D4037] font-semibold text-sm">Cargando mapa satelital...</p>
          </div>
        </div>
      }
    >
      <TrackingContent />
    </React.Suspense>
  );
}
