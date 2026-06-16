"use client";
import React from "react";
import { useBooking } from "@/context/BookingProvider";
import PayerForm from "./step-five/PayerForm";
import PaymentMethods from "./step-five/PaymentMethods";
import StepFiveSidebar from "./step-five/StepFiveSidebar";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/config/axios";
import { BookingPayload } from "./types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { ResponseSaveReserver } from "@/interface/save-reserver.interface";

export default function StepFive() {
  const {
    selectedSeats,
    payerData,
    paymentMethod,
    passengers,
    response,
    reserverSelected,
    hotelSelected,
    setStep,
    bus,
  } = useBooking();

  const [appliedPromoCode, setAppliedPromoCode] = React.useState<string>("");
  const [promoDiscount, setPromoDiscount] = React.useState<number>(0);

  const originName = response?.origin?.name || "TRUJILLO";
  const destinationName = response?.destination?.name || "LIMA";
  // Mock terminal names for now, or use from response if available
  const originTerminal = "Terminal Ittsa Terrapuerto";
  const destinationTerminal = "Terminal Plaza Norte";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "15 Oct, 2023";
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d
      .toLocaleDateString("es-ES", { month: "short" })
      .toUpperCase();
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const travelDate = formatDate(reserverSelected?.date);
  const travelTime = "21:45"; // Mocked time from design

  // Validate if payer form is complete
  const isPayerComplete =
    payerData?.documentType &&
    payerData?.documentNumber &&
    payerData?.names &&
    payerData?.lastName &&
    payerData?.birthDate &&
    payerData?.email;

  const isReadyToPay = Boolean(isPayerComplete && paymentMethod);
  const router = useRouter();
  const { token } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BookingPayload) => {
      const res = await instance.post("/public/booking/pay", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: (data: ResponseSaveReserver) => {
      toast.success("¡Pago procesado con éxito!");
      const dataToSave = {
        ...data,
        originName,
        destinationName,
      };
      localStorage.setItem("lastBookingResult", JSON.stringify(dataToSave));
      router.push("/reservas/completo");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error procesando pago");
    },
  });

  const handlePay = () => {
    if (!reserverSelected?.reserverId || !paymentMethod) return;

    const payload: BookingPayload = {
      reserverId: reserverSelected.reserverId,
      payer: payerData,
      paymentMethod: paymentMethod,
      hotel: hotelSelected,
      busId: bus?.busId || 0,
      fromDestinationId: response?.origin?.destinationId || 0,
      toDestinationId: response?.destination?.destinationId || 0,
      passengers: passengers.map((p, index: number) => {
        const seat = selectedSeats[index];
        return {
          ...p,
          ...seat,
        };
      }),
      promoCode: appliedPromoCode || undefined,
    };

    mutate(payload);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Forms & Payment Methods */}
        <div className="col-span-2 flex flex-col gap-8">
          <PayerForm />
          <PaymentMethods />

          <div className="flex justify-start items-center mt-4 mb-8">
            <button
              onClick={() => setStep(4)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2"
            >
              <span>←</span> VOLVER A PASAJEROS
            </button>
          </div>
        </div>

        <div className="col-span-1 h-full relative">
          <StepFiveSidebar
            origin={originName}
            originTerminal={originTerminal}
            destination={destinationName}
            destinationTerminal={destinationTerminal}
            date={travelDate}
            time={travelTime}
            selectedSeats={selectedSeats}
            serviceCharge={0.0}
            onPay={handlePay}
            isReadyToPay={isReadyToPay}
            isPending={isPending}
            hotelSelected={hotelSelected}
            appliedPromoCode={appliedPromoCode}
            promoDiscount={promoDiscount}
            onPromoApplied={(code, discount) => {
              setAppliedPromoCode(code);
              setPromoDiscount(discount);
            }}
          />
        </div>

      </div>
    </div>
  );
}
