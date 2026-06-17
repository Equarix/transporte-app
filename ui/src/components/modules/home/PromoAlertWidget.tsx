"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { instance } from "@/config/axios";
import {
  LuPhone,
  LuMapPin,
  LuBell,
  LuLoader,
  LuMessageSquare,
  LuCheck,
  LuSparkles,
} from "react-icons/lu";

// Zod Schema for subscription form
const subscriptionSchema = z.object({
  phone: z
    .string()
    .min(9, "El número de teléfono debe tener al menos 9 dígitos")
    .regex(/^\+?[0-9\s-]+$/, "Número de teléfono inválido"),
  destinationName: z
    .string()
    .min(1, "Debe seleccionar un destino de interés"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface WhatsappResponse {
  success: boolean;
  recipient: string;
  message: string;
  channel: string;
}

export default function PromoAlertWidget() {
  const [loading, setLoading] = useState(false);
  const [simulatedMessage, setSimulatedMessage] = useState<WhatsappResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      phone: "",
      destinationName: "",
    },
  });

  const onSubmit = async (data: SubscriptionFormValues) => {
    setLoading(true);
    setSimulatedMessage(null);
    try {
      // Direct call to public/ia proxy endpoint for simulation
      const res = await instance.post<any>(
        "/public/ia/alerts/whatsapp",
        data
      );
      setSimulatedMessage(res.data?.body || null);
      reset({ phone: "", destinationName: "" });
    } catch (err) {
      console.error("Error simulating WhatsApp alert", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-xs max-w-4xl mx-auto">
      <div className="border-b border-gray-100 pb-6 mb-6">
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Alertas de Viaje (RF-04)
        </span>
        <h3 className="text-2xl font-black text-gray-900 mt-2 flex items-center gap-2">
          Promociones Personalizadas en WhatsApp
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Dinos cuál es tu destino favorito y recibe cupones de descuento automáticos directo en tu móvil.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-6 space-y-4">
          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Número de Celular / WhatsApp
            </label>
            <div className="relative">
              <LuPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input
                type="tel"
                placeholder="Ej. +51 987654321"
                {...register("phone")}
                className={`w-full pl-11 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-sm focus:outline-none transition-all ${
                  errors.phone
                    ? "border-red-350 focus:ring-1 focus:ring-red-300"
                    : "border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 font-medium pl-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Destination Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Destino de Interés
            </label>
            <div className="relative">
              <LuMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <select
                {...register("destinationName")}
                className={`w-full pl-11 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-sm focus:outline-none transition-all appearance-none cursor-pointer ${
                  errors.destinationName
                    ? "border-red-350 focus:ring-1 focus:ring-red-300"
                    : "border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                }`}
              >
                <option value="">Selecciona tu destino...</option>
                <option value="Trujillo">Trujillo</option>
                <option value="Lima">Lima</option>
                <option value="Chiclayo">Chiclayo</option>
                <option value="Cajamarca">Cajamarca</option>
                <option value="Chimbote">Chimbote</option>
              </select>
            </div>
            {errors.destinationName && (
              <p className="text-xs text-red-500 font-medium pl-1">
                {errors.destinationName.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#e87722] hover:bg-[#d66513] disabled:bg-gray-300 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            {loading ? (
              <>
                <LuLoader className="animate-spin size-4" />
                Registrando Interés...
              </>
            ) : (
              <>
                <LuBell className="size-4" />
                Suscribirme y Enviar Alerta
              </>
            )}
          </button>
        </form>

        {/* WhatsApp Simulation bubble on the right */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-6 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-20" />

            {!simulatedMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 relative z-10 py-4">
                <div className="size-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#e87722]">
                  <LuSparkles className="size-6 animate-pulse" />
                </div>
                <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">
                  Simulador de WhatsApp
                </h4>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Completa tu registro para simular el envío de un mensaje de WhatsApp a través del microservicio de IA en Python.
                </p>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                {/* Chat header */}
                <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3">
                  <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-black">
                    WA
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-800">Entrafesa Alertas</h4>
                    <p className="text-[9px] text-emerald-600 font-bold">Simulación en vivo (Canal: {simulatedMessage.channel})</p>
                  </div>
                </div>

                {/* WhatsApp Message Balloon */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl rounded-tl-none p-4 max-w-[90%] shadow-xs">
                  <p className="text-xs text-gray-850 whitespace-pre-line leading-relaxed">
                    {simulatedMessage.message}
                  </p>
                  <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-emerald-100/50">
                    <span className="text-[9px] text-emerald-800 font-black uppercase tracking-wider flex items-center gap-1">
                      <LuCheck size={10} /> Cupón Activo
                    </span>
                    <span className="text-[8px] text-gray-400 font-semibold">
                      Enviado a: {simulatedMessage.recipient}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
