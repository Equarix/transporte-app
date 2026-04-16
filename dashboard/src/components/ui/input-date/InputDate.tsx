import { cn } from "@/utils/cn";
import { Calendar, CalendarDate, DateInput } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { parseDate } from "@internationalized/date";
import { useState } from "react";
import { useClose } from "@/hooks/useClose";
interface InputDateProps {
  label: string;
  className?: string;
  value?: Date;
  onChange?: (date: Date) => void;
}

export default function InputDate({
  label,
  className,
  value,
  onChange,
}: InputDateProps) {
  const convertDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return parseDate(`${year}-${month}-${day}`);
  };
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClose({
    closeFunction: () => {
      setIsOpen(false);
    },
  });

  return (
    <div
      className={cn("w-full relative", className)}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
      ref={ref}
    >
      <DateInput
        label={label}
        labelPlacement="outside"
        value={
          value ? (convertDate(value) as unknown as CalendarDate) : undefined
        }
        className="w-full"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="absolute top-full left-0 w-auto shadow-lg rounded-md overflow-hidden z-10"
          >
            <Calendar
              aria-label="Date (International Calendar)"
              onChange={(date: CalendarDate) => {
                setIsOpen(false);
                onChange?.(new Date(date.year, date.month - 1, date.day));
              }}
              value={
                value
                  ? (convertDate(value) as unknown as CalendarDate)
                  : undefined
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
