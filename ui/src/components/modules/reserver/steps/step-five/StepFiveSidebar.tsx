import React, { useState } from "react";
import { SeatSelection } from "@/context/BookingProvider";
import { FaLock } from "react-icons/fa";
import { instance } from "@/config/axios";
import { ApiResponse } from "@/interface/utils.interface";

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
  hotelSelected?: any | null;
  appliedPromoCode: string;
  promoDiscount: number;
  onPromoApplied: (code: string, discount: number) => void;
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
  hotelSelected,
  appliedPromoCode,
  promoDiscount,
  onPromoApplied,
}: StepFiveSidebarProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const hotelNights = (() => {
    if (!hotelSelected?.checkIn || !hotelSelected?.checkOut)
      return hotelSelected?.nights || 1;
    const checkInDate = new Date(hotelSelected.checkIn);
    const checkOutDate = new Date(hotelSelected.checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  })();
  const hotelCost = hotelSelected
    ? hotelSelected.price_per_night * hotelNights
    : 0;

  const subtotal = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  const total = Math.max(
    0,
    subtotal + serviceCharge + hotelCost - promoDiscount,
  );

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsVerifyingCoupon(true);
    setCouponError("");

    try {
      const res = await instance.post<
        ApiResponse<{
          valid: boolean;
          message: string;
          discountAmount?: number;
        }>
      >("/promos/validate", {
        code: couponCode.trim(),
        saleId: 1,
        purchaseAmount: subtotal,
      });

      const body = res.data?.body;
      if (body?.valid) {
        onPromoApplied(couponCode.trim(), body.discountAmount || 0);
        setCouponError("");
      } else {
        setCouponError(body?.message || "Cupón inválido");
        onPromoApplied("", 0);
      }
    } catch (err) {
      console.error(err);
      setCouponError("Error al validar el cupón");
      onPromoApplied("", 0);
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    onPromoApplied("", 0);
    setCouponCode("");
    setCouponError("");
  };

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

      {hotelSelected && (
        <div className="flex flex-col mb-8 pb-6 border-b border-gray-200">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Estancia en Hotel
          </p>
          <p className="text-sm font-bold text-gray-900 mb-1">
            {hotelSelected.name}
          </p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Entrada: {hotelSelected.checkIn}</span>
            <span>Salida: {hotelSelected.checkOut}</span>
          </div>
        </div>
      )}

      {/* Coupon Input Section */}
      <div className="bg-white rounded-2xl p-5 shadow-xs mb-6 border border-gray-100">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
          ¿Tienes un cupón de descuento?
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="CÓDIGO DE CUPÓN"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            disabled={!!appliedPromoCode}
            className="w-full pl-4 pr-22 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#e87722]/20 focus:border-[#e87722] uppercase placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700"
          />
          <div className="absolute right-1">
            {appliedPromoCode ? (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[10px] transition-all border border-red-100"
              >
                Quitar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isVerifyingCoupon || !couponCode.trim()}
                className="px-3 py-1.5 bg-[#8b5a2b] hover:bg-[#724921] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-lg text-[10px] transition-all"
              >
                {isVerifyingCoupon ? "..." : "Aplicar"}
              </button>
            )}
          </div>
        </div>
        {couponError && (
          <p className="text-[10px] font-bold text-red-500 mt-2">
            {couponError}
          </p>
        )}
        {appliedPromoCode && (
          <p className="text-[10px] font-bold text-emerald-600 mt-2">
            ¡Cupón "{appliedPromoCode}" aplicado!
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Subtotal Pasajes</span>
            <span className="font-bold text-gray-900">
              S/ {subtotal.toFixed(2)}
            </span>
          </div>
          {hotelSelected && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                Hotel ({hotelNights} {hotelNights === 1 ? "noche" : "noches"})
              </span>
              <span className="font-bold text-gray-900">
                S/ {hotelCost.toFixed(2)}
              </span>
            </div>
          )}
          {serviceCharge > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Cargos por Servicio</span>
              <span className="font-bold text-gray-900">
                S/ {serviceCharge.toFixed(2)}
              </span>
            </div>
          )}
          {promoDiscount > 0 && (
            <div className="flex justify-between items-center text-sm text-emerald-600 font-bold bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50">
              <span>Descuento Cupón ({appliedPromoCode})</span>
              <span>- S/ {promoDiscount.toFixed(2)}</span>
            </div>
          )}
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
