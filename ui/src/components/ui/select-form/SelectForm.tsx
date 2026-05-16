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
import { LuChevronDown } from "react-icons/lu";

interface SelectOption {
  label: string;
  value: any;
}

interface SelectFormProps {
  label?: string;
  icon?: ReactNode;
  items: SelectOption[];
  placeholder?: string;
  className?: string;
  value?: any;
  onChange?: (value: any) => void;
  name?: string;
  onBlur?: () => void;
  error?: string;
}

const SelectForm = forwardRef<HTMLInputElement, SelectFormProps>(
  (
    {
      label,
      icon,
      items,
      placeholder,
      className,
      value,
      onChange,
      name,
      onBlur,
      error,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<SelectOption | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sincronizar valor externo (útil para react-hook-form)
    useEffect(() => {
      if (value !== undefined) {
        const item = items.find((i) => i.value === value);
        setSelected(item || null);
      }
    }, [value, items]);

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

    const handleSelect = (item: SelectOption) => {
      setSelected(item);
      setIsOpen(false);
      onChange?.(item.value);
    };

    return (
      <div className="flex flex-col gap-2 w-full relative" ref={containerRef}>
        {/* Input oculto para compatibilidad con refs y formularios */}
        <input
          type="hidden"
          name={name}
          value={selected?.value || ""}
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
          onBlur={onBlur}
          className={cn(
            "flex items-center gap-4 bg-[#F2F2F2] px-7 rounded-[40px] h-13.75 transition-all relative text-left w-full",
            isOpen && "ring-2 ring-[#5D4037]/10 bg-white shadow-sm",
            error && "ring-2 ring-red-500/50 bg-red-50/50",
            className,
          )}
        >
          {icon && (
            <div className="text-[#8B7E74] shrink-0 text-2xl">{icon}</div>
          )}

          <span
            className={cn(
              "font-medium flex-1 truncate",
              selected ? "text-[#333333]" : "text-[#999999]",
            )}
          >
            {selected ? selected.label : placeholder}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "backOut" }}
            className="text-[#8B7E74] text-2xl"
          >
            <LuChevronDown />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "circOut" }}
              className="absolute top-full left-0 w-full bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 overflow-hidden border border-gray-100 mt-1"
            >
              <div className="max-h-75 overflow-y-auto p-2 custom-scrollbar">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <motion.button
                      key={item.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "w-full text-left px-6 py-4 rounded-[20px] text-lg font-medium transition-all mb-1 last:mb-0",
                        selected?.value === item.value
                          ? "bg-[#5D4037] text-white shadow-md"
                          : "text-[#333333] hover:bg-[#F2F2F2] hover:pl-8",
                      )}
                    >
                      {item.label}
                    </motion.button>
                  ))
                ) : (
                  <div className="px-6 py-4 text-[#999999] text-center italic">
                    No hay opciones
                  </div>
                )}
              </div>
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

SelectForm.displayName = "SelectForm";

export default SelectForm;
