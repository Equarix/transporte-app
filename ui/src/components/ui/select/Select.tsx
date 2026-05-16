"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useMemo, useState } from "react";

interface SelectProps {
  label: string;
  icon: ReactNode;
  placeholder: string;
  items: Array<{
    label: string;
    value: string;
  }>;
  className?: {
    container?: string;
  };
  onSelect?: (value: string) => void;
  value?: string;
}

export default function Select({
  label,
  icon,
  placeholder,
  items,
  className,
  onSelect,
  value,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const valueLabel = useMemo(() => {
    const item = items.find((i) => i.value === value);
    return item;
  }, [value, items]);

  return (
    <section className={cn("relative", className?.container)}>
      <div className="space-y-2.5">
        <p className="text-xs font-semibold">{label}</p>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full p-4 bg-[#F6F3F2] rounded-lg flex items-center gap-4 px-4"
          type="button"
        >
          <span className="size-4 text-amber-700">{icon}</span>

          <span className="text-sm text-amber-700">
            {valueLabel?.label || placeholder}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg z-10"
          >
            {items.map((item) => (
              <button
                key={item.value}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  onSelect?.(item.value);
                  setIsOpen(false);
                }}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
}
