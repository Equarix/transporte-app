import { GenericProps } from "@/interface/utils.interface";
import { cn } from "@/utils/cn";

export default function Icon({ children, className }: GenericProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
