"use client";

import { ResponseBooking } from "@/interface/response.interface";

interface BookingContextValue {
  response: ResponseBooking | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setResponse: (response: ResponseBooking) => void;
}
