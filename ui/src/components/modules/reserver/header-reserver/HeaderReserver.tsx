"use client";
import { useBooking } from "@/context/BookingProvider";
import { cn } from "@/utils/cn";
import { LuBus, LuCheck, LuHouse, LuTickets, LuUser } from "react-icons/lu";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import { Fragment } from "react/jsx-runtime";
const steps = [
  {
    step: 1,
    title: "Selección de Bus",
    icon: <LuBus size={20} />,
  },
  {
    step: 2,
    title: "Seleccionar Hotel",
    icon: <LuHouse size={20} />,
  },
  {
    step: 3,
    title: "Seleccionar Asientos",
    icon: <MdAirlineSeatReclineExtra size={20} />,
  },
  {
    step: 4,
    title: "Registrar Pasajeros",
    icon: <LuUser size={20} />,
  },
  {
    step: 5,
    title: "Pago",
    icon: <LuTickets size={20} />,
  },
];

export default function HeaderReserver() {
  const { step } = useBooking();

  return (
    <header className="w-full items-center flex max-w-5xl">
      {steps.map((item, idx) => (
        <Fragment key={item.step}>
          <div className="flex flex-col gap-1 justify-center items-center">
            <span
              className={cn(
                "size-10 rounded-full flex items-center justify-center bg-slate-200 text-slate-600",
                step === item.step && "bg-amber-700 text-white",
                step > item.step && "border border-amber-700 text-amber-700",
              )}
            >
              {step > item.step ? <LuCheck size={16} /> : item.icon}
            </span>

            <p>{item.title}</p>
          </div>

          {idx !== steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-0.5 bg-slate-200 mx-3",
                step > item.step && "bg-amber-700",
              )}
            />
          )}
        </Fragment>
      ))}
    </header>
  );
}
