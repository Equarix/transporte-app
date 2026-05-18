"use client";

import HeaderReserver from "@/components/modules/reserver/header-reserver/HeaderReserver";
import { useBooking } from "@/context/BookingProvider";

export default function ReservePage() {
  const { response } = useBooking();
  console.log(response);
  return (
    <main className="w-full h-full flex items-center justify-center p-10">
      <HeaderReserver />
    </main>
  );
}
