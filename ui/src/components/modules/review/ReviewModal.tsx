"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewForm } from "@/schema/review.schema";
import { instance } from "@/config/axios";
import { toast } from "sonner";
import { LuStar } from "react-icons/lu";

interface SaleDetail {
  saleDetailId: number;
  busId: number;
  seatId: number;
  amount: number;
  name: string;
}

interface Ticket {
  saleId: number;
  createdAt: string;
  userId: number;
  status: string;
  origin?: {
    name: string;
  };
  destination?: {
    name: string;
  };
  reserver?: {
    date: string;
    checkOutHour: string;
  };
  saleDetails: SaleDetail[];
}

interface ReviewModalProps {
  ticket: Ticket;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function ReviewModal({ ticket, onClose, onSubmitSuccess }: ReviewModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      comfortScore: 0,
      punctualityScore: 0,
      serviceScore: 0,
      driverScore: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewForm) => {
    try {
      await instance.post("/resenas", {
        saleId: ticket.saleId,
        comfortScore: data.comfortScore,
        punctualityScore: data.punctualityScore,
        serviceScore: data.serviceScore,
        driverScore: data.driverScore,
        comment: data.comment || "",
      });
      toast.success("¡Gracias por calificar tu viaje!");
      onSubmitSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al enviar la reseña";
      toast.error(msg);
    }
  };

  const StarInput = ({
    value,
    onChange,
    label,
    error,
  }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
    error?: string;
  }) => {
    return (
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          {label}
        </label>
        <div className="flex items-center gap-1.5 py-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="group transition-transform active:scale-90 focus:outline-hidden"
            >
              <LuStar
                className={`size-7 transition-all ${
                  star <= value
                    ? "fill-amber-400 text-amber-500 scale-110"
                    : "text-gray-300 hover:text-amber-300"
                }`}
              />
            </button>
          ))}
        </div>
        {error && <p className="text-[11px] font-bold text-red-500">{error}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-700 to-amber-900 text-white shrink-0">
          <h2 className="text-xl font-black">¿Cómo estuvo tu viaje?</h2>
          <p className="text-xs text-amber-100/90 mt-1">
            Ayúdanos a mejorar calificando tu servicio en el viaje de{" "}
            <span className="font-bold text-white">
              {ticket.origin?.name || "Origen"}
            </span>{" "}
            a{" "}
            <span className="font-bold text-white">
              {ticket.destination?.name || "Destino"}
            </span>
            .
          </p>
        </div>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 overflow-y-auto space-y-5 flex-1"
        >
          {/* Question 1: Comfort */}
          <Controller
            control={control}
            name="comfortScore"
            render={({ field }) => (
              <StarInput
                value={field.value}
                onChange={field.onChange}
                label="Comodidad del Bus"
                error={errors.comfortScore?.message}
              />
            )}
          />

          {/* Question 2: Punctuality */}
          <Controller
            control={control}
            name="punctualityScore"
            render={({ field }) => (
              <StarInput
                value={field.value}
                onChange={field.onChange}
                label="Puntualidad del Viaje"
                error={errors.punctualityScore?.message}
              />
            )}
          />

          {/* Question 3: Service */}
          <Controller
            control={control}
            name="serviceScore"
            render={({ field }) => (
              <StarInput
                value={field.value}
                onChange={field.onChange}
                label="Servicio y Atención a Bordo"
                error={errors.serviceScore?.message}
              />
            )}
          />

          {/* Question 4: Driver */}
          <Controller
            control={control}
            name="driverScore"
            render={({ field }) => (
              <StarInput
                value={field.value}
                onChange={field.onChange}
                label="Conducción del Piloto (Seguridad)"
                error={errors.driverScore?.message}
              />
            )}
          />

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Comentarios adicionales (Opcional)
            </label>
            <Controller
              control={control}
              name="comment"
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Cuéntanos más detalles sobre tu experiencia..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/10 focus:border-amber-600 text-sm font-semibold resize-none"
                />
              )}
            />
            {errors.comment && (
              <p className="text-[11px] font-bold text-red-500">
                {errors.comment.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-all disabled:opacity-50"
            >
              Calificar más tarde
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                "Enviar Calificación"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
