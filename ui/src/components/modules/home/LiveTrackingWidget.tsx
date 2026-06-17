"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/config/axios";
import { ApiResponse } from "@/interface/utils.interface";
import {
  LuBus,
  LuClock,
  LuMapPin,
  LuNavigation,
  LuSearch,
  LuLoader,
  LuCompass,
  LuCheck,
} from "react-icons/lu";

// Form validation schema with Zod
const searchSchema = z.object({
  reserverId: z
    .string()
    .min(1, "El código de reserva es requerido")
    .regex(/^\d+$/, "El código de reserva debe ser un número entero"),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface TrackingData {
  reserverId: number;
  bus: {
    plate: string;
    model: string;
    type: string;
    capacity: number;
  };
  driver: {
    name: string;
    license: string;
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
    status: string;
  };
  services: { name: string; available: boolean }[];
}

export default function LiveTrackingWidget() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      reserverId: "",
    },
  });

  // Query to fetch public tracking info from python/IA API through public proxy
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<TrackingData>({
    queryKey: ["public-tracking", activeId],
    queryFn: async () => {
      const res = await instance.get<TrackingData>(
        `/public/ia/tracking/${activeId}`
      );
      return res.data;
    },
    enabled: !!activeId,
    refetchInterval: 5000, // Refresh every 5 seconds to simulate real-time GPS tracking
  });

  const onSubmit = (data: SearchFormValues) => {
    setActiveId(data.reserverId);
  };

  const progress = response?.currentLocation?.progressPercentage || 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-xs max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 mb-6">
        <div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            GPS Satelital
          </span>
          <h3 className="text-2xl font-black text-gray-900 mt-2">
            Seguimiento de Viaje en Vivo
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Visualiza la ubicación real del bus y el tiempo estimado de llegada.
          </p>
        </div>

        {/* Demo IDs Quick Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-gray-400 uppercase">Probar Demo:</span>
          <button
            onClick={() => setActiveId("1")}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border transition-all ${
              activeId === "1"
                ? "bg-amber-600 border-amber-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Reserva #1
          </button>
          <button
            onClick={() => setActiveId("12")}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border transition-all ${
              activeId === "12"
                ? "bg-amber-600 border-amber-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Reserva #12
          </button>
        </div>
      </div>

      {/* Form Search Input */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Ingresa el código de reserva (ej. 1, 2, 12)..."
              {...register("reserverId")}
              className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-2xl text-sm focus:outline-none transition-all ${
                errors.reserverId
                  ? "border-red-350 focus:ring-1 focus:ring-red-300"
                  : "border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              }`}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#5D4037] hover:bg-[#4E342E] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <LuCompass className="size-4" />
            Rastrear Autobús
          </button>
        </div>
        {errors.reserverId && (
          <p className="text-xs text-red-500 font-medium pl-1">
            {errors.reserverId.message}
          </p>
        )}
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="h-64 flex flex-col items-center justify-center space-y-3 bg-gray-50/50 rounded-2xl border border-gray-100">
          <LuLoader className="animate-spin text-[#e87722] size-8" />
          <p className="text-xs text-gray-500 font-bold">Conectando con el GPS del bus...</p>
        </div>
      )}

      {/* Error or Empty State */}
      {isError && (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-red-50/20 border border-red-100 rounded-2xl space-y-3">
          <div className="size-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <LuCompass className="size-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-800">Servicio de Rastreo no Disponible</h4>
          <p className="text-xs text-gray-500 max-w-sm">
            No pudimos contactar con el bus seleccionado. Por favor, asegúrate de usar un código de reserva válido.
          </p>
        </div>
      )}

      {/* Tracking Data Found */}
      {response && !isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Progress telemetry card */}
          <div className="lg:col-span-4 bg-linear-to-br from-amber-50 to-[#fffbf7] border border-amber-100 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {response.eta.status || "En Ruta"}
                </span>
                <h4 className="text-lg font-black text-gray-800 mt-2">
                  IT-{response.reserverId}
                </h4>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Placa del Bus</p>
                <p className="text-sm font-extrabold text-gray-700">{response.bus.plate} ({response.bus.model})</p>
                <p className="text-xs text-gray-500">{response.bus.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Piloto</p>
                <p className="text-sm font-extrabold text-gray-700">{response.driver.name}</p>
              </div>
            </div>
            
            <div className="border-t border-amber-100/50 pt-4 mt-4 space-y-1">
              <p className="text-xs text-amber-800 font-bold flex items-center gap-1.5">
                <LuClock className="animate-pulse" /> Tiempo Estimado
              </p>
              <p className="text-2xl font-black text-amber-950">
                {response.eta.minutesRemaining} min
              </p>
              <p className="text-[10px] text-amber-700 font-medium">
                {progress}% de la ruta completada
              </p>
            </div>
          </div>

          {/* Interactive GPS map visualization */}
          <div className="lg:col-span-8 bg-gray-50 border border-gray-150 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center p-8 min-h-[280px]">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35" />

            <div className="w-11/12 h-1.5 bg-gray-200 rounded-full relative z-10">
              {/* Completed Line */}
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />

              {/* Origin Pin */}
              <div className="absolute -left-2.5 -top-3 flex flex-col items-center">
                <div className="size-6 rounded-full bg-[#5D4037] border-2 border-white shadow-md flex items-center justify-center text-white">
                  <LuMapPin size={10} />
                </div>
                <span className="text-[9px] font-black text-gray-600 bg-white px-1.5 py-0.5 rounded-full border border-gray-100 shadow-xs mt-1.5 max-w-[80px] truncate">
                  {response.origin.name.split(" ")[0]}
                </span>
              </div>

              {/* Destination Pin */}
              <div className="absolute -right-2.5 -top-3 flex flex-col items-center">
                <div className="size-6 rounded-full bg-amber-600 border-2 border-white shadow-md flex items-center justify-center text-white">
                  <LuMapPin size={10} />
                </div>
                <span className="text-[9px] font-black text-gray-600 bg-white px-1.5 py-0.5 rounded-full border border-gray-100 shadow-xs mt-1.5 max-w-[80px] truncate">
                  {response.destination.name.split(" ")[0]}
                </span>
              </div>

              {/* Live Bus Marker */}
              <div
                className="absolute -top-5.5 transition-all duration-1000 flex flex-col items-center"
                style={{ left: `calc(${progress}% - 12px)` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 size-6 rounded-full bg-amber-500 animate-ping opacity-25" />
                  <div className="size-6 rounded-full bg-[#e87722] border border-white shadow-md flex items-center justify-center text-white relative z-10">
                    <LuNavigation size={10} className="rotate-90 animate-bounce" />
                  </div>
                </div>
                <span className="text-[8px] font-black text-white bg-[#e87722] px-1.5 py-0.5 rounded-full mt-1 whitespace-nowrap shadow-xs">
                  {response.bus.plate}
                </span>
              </div>
            </div>

            {/* GPS Telemetry Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-gray-150 rounded-xl px-3 py-2 shadow-sm flex items-center gap-2.5 max-w-xs z-20">
              <div className="size-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <LuCheck size={14} className="animate-pulse" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-extrabold text-gray-800">Ubicación Satelital Activa</p>
                <p className="text-[8px] text-gray-400 mt-0.5">
                  Lat: {response.currentLocation.lat.toFixed(4)} | Lng: {response.currentLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
