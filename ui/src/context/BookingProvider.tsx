"use client";

import { ResponseBooking } from "@/interface/response.interface";
import { createContext, useContext, useState } from "react";

interface BookingContextValue {
  response: ResponseBooking | null;
  isLoading: boolean;
  step: number;
  setStep: (step: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setResponse: (response: ResponseBooking) => void;
}

export const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
);

export function BookingProvider({
  children,
  response,
}: {
  children: React.ReactNode;
  response: ResponseBooking;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResponse, setBookingResponse] =
    useState<ResponseBooking | null>(response);

  const setResponse = (response: ResponseBooking) => {
    setBookingResponse(response);
  };

  const [step, setStep] = useState(1);

  return (
    <BookingContext
      value={{
        response: bookingResponse,
        isLoading,
        setIsLoading,
        setResponse,
        setStep,
        step,
      }}
    >
      {children}
    </BookingContext>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }

  return context;
}
