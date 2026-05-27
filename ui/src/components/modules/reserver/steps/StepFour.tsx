"use client";
import React, { useEffect } from "react";
import { useBooking } from "@/context/BookingProvider";
import PassengerForm, { PassengerData } from "./step-four/PassengerForm";
import StepFourSidebar from "./step-four/StepFourSidebar";

export default function StepFour() {
  const { selectedSeats, passengers, setPassengers, setStep, response, reserverSelected } = useBooking();

  // Initialize passengers based on selected seats
  useEffect(() => {
    if (selectedSeats.length > 0 && passengers.length !== selectedSeats.length) {
      const initialPassengers = selectedSeats.map((seat, index) => {
        // preserve existing if it exists
        if (passengers[index]) return passengers[index];
        return {
          documentType: "DNI",
          documentNumber: "",
          names: "",
          lastName: "",
          motherLastName: "",
          gender: "",
          birthDate: "",
        };
      });
      setPassengers(initialPassengers);
    }
  }, [selectedSeats, passengers, setPassengers]);

  const handlePassengerChange = (index: number, data: PassengerData) => {
    const newPassengers = [...passengers];
    newPassengers[index] = data;
    setPassengers(newPassengers);
  };

  const isPassengerComplete = (p: PassengerData | undefined) => {
    if (!p) return false;
    return (
      p.documentNumber.length > 0 &&
      p.names.length > 0 &&
      p.lastName.length > 0 &&
      p.motherLastName.length > 0 &&
      p.gender.length > 0 &&
      p.birthDate.length > 0
    );
  };

  const originName = response?.origin?.name || "TRUJILLO";
  const destinationName = response?.destination?.name || "LIMA";
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "14 ABR, 2026";
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const travelDate = formatDate(reserverSelected?.date);
  const travelTime = "22:30 PM"; // Mocked time

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Forms */}
        <div className="col-span-2 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
              REGISTRA <span className="text-[#8b5a2b]">PASAJEROS</span>
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl">
              Complete la información de cada viajero para asegurar su lugar en el Kinetic Express.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {selectedSeats.map((seat, index) => {
              const pData = passengers[index] || {
                documentType: "DNI",
                documentNumber: "",
                names: "",
                lastName: "",
                motherLastName: "",
                gender: "",
                birthDate: "",
              };
              
              // Locked if previous passenger is not complete
              const isLocked = index > 0 && !isPassengerComplete(passengers[index - 1]);

              return (
                <PassengerForm
                  key={`${seat.floor}-${seat.name}`}
                  seat={seat}
                  isLocked={isLocked}
                  data={pData}
                  onChange={(data) => handlePassengerChange(index, data)}
                />
              );
            })}
          </div>

          {/* Navigation Actions */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setStep(3)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2"
            >
              <span>←</span> ANTERIOR
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={!passengers.every(isPassengerComplete)}
              className="bg-[#e87722] hover:bg-[#d96a1a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-orange-500/20"
            >
              SIGUIENTE: PAGO
            </button>
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div className="col-span-1 h-full relative">
          <StepFourSidebar
            origin={originName}
            destination={destinationName}
            date={travelDate}
            time={travelTime}
            selectedSeats={selectedSeats}
            discount={10.0}
          />
        </div>
      </div>
    </div>
  );
}
