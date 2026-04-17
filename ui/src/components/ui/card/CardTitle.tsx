import { GenericProps } from "@/interface/utils.interface";
import { cn } from "@/utils/cn";

export default function CardTitle({ children, className }: GenericProps) {
  return <h3 className={cn("text-xl font-bold", className)}>{children}</h3>;
}
