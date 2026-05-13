"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker as ReactDayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

interface DayPickerProps {
  label: string;
  icon: ReactNode;
  placeholder: string;
  className?: {
    container?: string;
  };
  onSelect?: (date: Date | undefined) => void;
  selected?: Date;
}

export default function DayPicker({
  label,
  icon,
  placeholder,
  className,
  onSelect,
  selected,
}: DayPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={cn("relative", className?.container)}>
      <div className="space-y-2.5">
        <p className="text-xs font-semibold">{label}</p>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full p-4 bg-[#F6F3F2] rounded-lg flex items-center gap-4 px-4"
        >
          <span className="size-4 text-amber-700">{icon}</span>

          <span className="text-sm text-amber-700">
            {selected ? format(selected, "PPP", { locale: es }) : placeholder}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden absolute top-full left-0 min-w-max mt-2 bg-white rounded-lg shadow-lg z-50"
          >
            <div className="p-4 flex justify-center">
              <ReactDayPicker
                mode="single"
                selected={selected}
                onSelect={(date) => {
                  onSelect?.(date);
                  setIsOpen(false);
                }}
                locale={es}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
}
