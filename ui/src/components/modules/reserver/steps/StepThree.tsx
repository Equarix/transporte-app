"use client";
import React from "react";
import { useBooking } from "@/context/BookingProvider";
import { instance } from "@/config/axios";
import BusLegend from "./step-three/BusLegend";
import BusFloor from "./step-three/BusFloor";
import BusSeat from "./step-three/BusSeat";
import BookingSidebar from "./step-three/BookingSidebar";
import { useQuery } from "@tanstack/react-query";
import { Floor, Seat } from "@/interface/response.interface";

export default function StepThree() {
  const {
    reserverSelected,
    setBus,
    bus,
    selectedSeats,
    setSelectedSeats,
    setStep,
    response,
  } = useBooking();

  const {
    data: queryBus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bus", reserverSelected?.reserverId],
    queryFn: async () => {
      if (!reserverSelected?.reserverId) return null;
      const { data } = await instance.get(
        `/public/booking/bus/${reserverSelected.reserverId}`,
      );
      const busData = data.body || data;
      setBus(busData);
      return busData;
    },
    enabled: !!reserverSelected?.reserverId,
  });

  const activeBus = queryBus || bus;

  const toggleSeat = (seat: Seat, floorData: Floor) => {
    if (seat.reserver !== null && seat.reserver !== undefined && seat.reserver !== "") return;

    setSelectedSeats((prev) => {
      const isSelected = prev.some(
        (s) => s.name === seat.name && s.floor === floorData.order,
      );
      if (isSelected) {
        return prev.filter(
          (s) =>
            !(s.name === seat.name && s.floor === floorData.order),
        );
      } else {
        return [
          ...prev,
          {
            ...seat,
            floor: floorData.order,
            type: floorData.name || `Piso ${floorData.order}`,
            price: 85.0,
          },
        ];
      }
    });
  };

  const getSeatStatus = (seat: Seat, floorOrder: number) => {
    if (
      selectedSeats.some(
        (s) => s.name === seat.name && s.floor === floorOrder,
      )
    )
      return "selected";
    
    // Si reserver tiene valor y no es vacio, asumimos que está vendido/reservado
    return (seat.reserver !== null && seat.reserver !== undefined && seat.reserver !== "") ? "sold" : "free";
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-20 text-center">
        <p className="text-xl font-bold text-gray-500 animate-pulse">
          Cargando asientos del bus...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto py-20 text-center">
        <p className="text-xl font-bold text-red-500">
          Ocurrió un error al cargar la información del bus.
        </p>
      </div>
    );
  }

  const originName = response?.origin?.name || "TRUJILLO (JUAN PABLO)";
  const destinationName = response?.destination?.name || "LIMA (LA VICTORIA)";
  const travelDate = reserverSelected?.date
    ? new Date(reserverSelected.date).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "Jueves, 24 de Octubre";

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Seat Layout */}
        <div className="col-span-2 flex flex-col gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-[#603314] mb-3 tracking-tight">
              Selecciona tu espacio
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl">
              Elige los asientos que prefieras para tu viaje. Contamos con
              tecnología de punta y máxima comodidad en cada piso.
            </p>
            <BusLegend />
          </div>

          <div className="flex flex-wrap gap-8 items-start">
            {activeBus?.floors?.map((floor: Floor) => {
              const floorNumber = floor.order;
              
              return (
                <BusFloor
                  key={floor.floorId || floorNumber}
                  floorNumber={floorNumber}
                  name={floor.name || `Piso ${floorNumber}`}
                >
                  <div 
                    className="grid gap-4 w-full"
                    style={{ 
                      gridTemplateColumns: `repeat(${floor.columns || 4}, minmax(3rem, 1fr))`,
                      gridTemplateRows: `repeat(${floor.rows || 5}, minmax(3rem, 1fr))`
                    }}
                  >
                    {floor.seats?.map((seat: Seat) => {
                      // Check for special seat types like stairs or empty spaces
                      const isStairs = seat.typeSeat?.toLowerCase().includes("stairs") || seat.typeSeat?.toLowerCase() === "escalera";
                      const isTV = seat.typeSeat?.toLowerCase().includes("tv") || seat.typeSeat?.toLowerCase() === "televisor";
                      const isAisle = seat.typeSeat?.toLowerCase().includes("aisle") || seat.typeSeat?.toLowerCase() === "pasillo";

                      return (
                        <div 
                          key={seat.seatId || seat.name}
                          style={{ 
                            gridColumn: seat.column, 
                            gridRow: seat.row 
                          }}
                          className="flex items-center justify-center"
                        >
                          {isStairs ? (
                            <div className="w-12 h-12 rounded-xl border border-[#f27166] bg-red-50 flex items-center justify-center opacity-80">
                              <span className="text-xl">🛗</span>
                            </div>
                          ) : isTV ? (
                            <div className="w-12 h-12 rounded-xl border border-gray-300 bg-gray-100 flex items-center justify-center opacity-80">
                              <span className="text-xl">📺</span>
                            </div>
                          ) : isAisle ? (
                            <div className="w-12 h-12 rounded-xl border border-dashed border-gray-300 flex items-center justify-center opacity-50">
                              <span className="text-[10px] text-gray-400">{seat.row},{seat.column}</span>
                            </div>
                          ) : (
                            <BusSeat
                              number={seat.name}
                              status={getSeatStatus(seat, floorNumber)}
                              isPetFriendly={seat.typeSeat?.toLowerCase().includes("pet")}
                              onSelect={() => toggleSeat(seat, floor)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </BusFloor>
              );
            })}
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div className="col-span-1 h-full relative">
          <BookingSidebar
            origin={originName}
            destination={destinationName}
            date={travelDate}
            selectedSeats={selectedSeats}
            serviceCharge={3.5}
            onNext={() => setStep(4)}
            onPrev={() => setStep(2)}
          />
        </div>
      </div>
    </div>
  );
}
