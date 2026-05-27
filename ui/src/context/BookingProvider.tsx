"use client";

import {
  ClientPay,
  Clients,
  PaymentMethod,
} from "@/components/modules/reserver/steps/types";
import { Daum } from "@/interface/hotel.interface";
import {
  Bus,
  Reserver,
  ResponseBooking,
  Seat,
} from "@/interface/response.interface";
import { createContext, useContext, useState } from "react";

export interface SeatSelection extends Seat {
  floor: number;
  type: string;
  price: number;
}

interface BookingContextValue {
  response: ResponseBooking | null;
  isLoading: boolean;
  step: number;
  reserverSelected: Reserver | null;
  hotelSelected: Daum | null;
  bus: Bus | null;
  selectedSeats: SeatSelection[];
  passengers: Clients[];
  payerData: ClientPay;
  paymentMethod: PaymentMethod | null;
  setPassengers: React.Dispatch<React.SetStateAction<Clients[]>>;
  setPayerData: React.Dispatch<React.SetStateAction<ClientPay>>;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
  setSelectedSeats: React.Dispatch<React.SetStateAction<SeatSelection[]>>;
  setBus: (bus: Bus) => void;
  setHotelSelected: (hotel: Daum | null) => void;
  setReserverSelected: (reserver: Reserver) => void;
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
  const [reserverSelected, setReserverSelected] = useState<any | null>(null);
  const [hotelSelected, setHotelSelected] = useState<any | null>(null);
  const [bus, setBus] = useState<any | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [passengers, setPassengers] = useState<Clients[]>([]);
  const [payerData, setPayerData] = useState<ClientPay>({
    documentType: "",
    documentNumber: "",
    names: "",
    lastName: "",
    motherLastName: "",
    gender: "",
    birthDate: "",
    email: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );

  const setResponse = (response: ResponseBooking) => {
    setBookingResponse(response);
  };

  const [step, setStep] = useState(1);

  return (
    <BookingContext
      value={{
        response: bookingResponse,
        isLoading,
        reserverSelected,
        setReserverSelected,
        hotelSelected,
        setHotelSelected,
        bus,
        setBus,
        selectedSeats,
        setSelectedSeats,
        passengers,
        setPassengers,
        payerData,
        setPayerData,
        paymentMethod,
        setPaymentMethod,
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
