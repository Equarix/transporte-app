"use client";
import HeaderReserver from "@/components/modules/reserver/header-reserver/HeaderReserver";
import ReserverSteps from "@/components/modules/reserver/ReserverSteps";

export default function ReservePage() {
  return (
    <main className="w-full min-h-[calc(100vh-80px)] bg-[#fdfcfb] flex flex-col items-center p-4 md:p-10">
      <div className="w-full space-y-8 max-w-5xl mx-auto">
        <HeaderReserver />
        <ReserverSteps />
      </div>
    </main>
  );
}
