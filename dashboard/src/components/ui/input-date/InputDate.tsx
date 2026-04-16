import { cn } from "@/utils/cn";
import {
  Calendar,
  CalendarDate,
  DateInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { useState } from "react";

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

  return (
    <div className={cn("w-full h-fit", className)}>
      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom"
        showArrow={true}
      >
        <PopoverTrigger>
          <div className="w-full cursor-pointer">
            <DateInput
              label={label}
              labelPlacement="outside"
              value={
                value
                  ? (convertDate(value) as unknown as CalendarDate)
                  : undefined
              }
              className="w-full pointer-events-none"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 border-none shadow-none">
          <Calendar
            aria-label="Date (International Calendar)"
            onChange={(date: CalendarDate) => {
              setIsOpen(false);
              onChange?.(new Date(date.year, date.month - 1, date.day));
            }}
            value={
              value ? (convertDate(value) as unknown as CalendarDate) : undefined
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
