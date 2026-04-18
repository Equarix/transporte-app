import { GenericProps } from "@/interface/utils.interface";
import { cn } from "@/utils/cn";

export default function Card({ children, className }: GenericProps) {
  return (
    <div
      className={cn("rounded-4xl flex flex-col bg-white shadow-xl", className)}
    >
      {children}
    </div>
  );
}
