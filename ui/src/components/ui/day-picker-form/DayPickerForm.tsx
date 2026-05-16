"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import React, {
  forwardRef,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker as ReactDayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { LuCalendar } from "react-icons/lu";

interface DayPickerFormProps {
  label?: string;
  icon?: ReactNode;
  placeholder?: string;
  className?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  error?: string;
  name?: string;
}

const DayPickerForm = forwardRef<HTMLInputElement, DayPickerFormProps>(
  (
    { label, icon, placeholder, className, value, onChange, error, name },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar al hacer click fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="flex flex-col gap-2 w-full relative" ref={containerRef}>
        {/* Input oculto para compatibilidad con refs y formularios */}
        <input
          type="hidden"
          name={name}
          value={value ? value.toISOString() : ""}
          ref={ref}
        />

        {label && (
          <label className="text-[11px] font-extrabold text-[#5D4037] uppercase tracking-widest ml-1 opacity-80">
            {label}
          </label>
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-4 bg-[#F2F2F2] px-7 rounded-[40px] h-13.75 transition-all relative text-left w-full",
            isOpen && "ring-2 ring-[#5D4037]/10 bg-white shadow-sm",
            error && "ring-2 ring-red-500/50 bg-red-50/50",
            className,
          )}
        >
          {icon ? (
            <div className="text-[#8B7E74] shrink-0 text-2xl">{icon}</div>
          ) : (
            <div className="text-[#8B7E74] shrink-0 text-2xl">
              <LuCalendar />
            </div>
          )}

          <span
            className={cn(
              "font-medium flex-1 truncate",
              value ? "text-[#333333]" : "text-[#999999]",
            )}
          >
            {value
              ? format(value, "PPP", { locale: es })
              : placeholder || "Seleccionar fecha"}
          </span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "circOut" }}
              className="absolute top-full left-0 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 p-6 border border-gray-100 mt-1"
            >
              <style>{`
                .rdp {
                  --rdp-cell-size: 40px;
                  --rdp-accent-color: #5D4037;
                  --rdp-background-color: #F2F2F2;
                  margin: 0;
                }
                .rdp-day_selected {
                  background-color: var(--rdp-accent-color) !important;
                  color: white !important;
                  border-radius: 12px;
                }
                .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                  background-color: var(--rdp-background-color);
                  border-radius: 12px;
                }
                .rdp-head_cell {
                  color: #8B7E74;
                  font-size: 11px;
                  font-weight: 800;
                  text-transform: uppercase;
                }
                .rdp-caption_label {
                  font-weight: 800;
                  color: #333333;
                  text-transform: capitalize;
                }
                .rdp-nav_button {
                  color: #5D4037;
                }
              `}</style>
              <ReactDayPicker
                mode="single"
                selected={value}
                onSelect={(date) => {
                  onChange?.(date);
                  if (date) setIsOpen(false);
                }}
                locale={es}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-4">
            {error}
          </p>
        )}
      </div>
    );
  },
);

DayPickerForm.displayName = "DayPickerForm";

export default DayPickerForm;
