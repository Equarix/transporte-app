import { GenericProps } from "@/interface/utils.interface";
import { cn } from "@/utils/cn";
export default function CardFooter({ children, className }: GenericProps) {
  return (
    <div className={cn("p-6 pt-0 flex flex-col gap-6", className)}>
      {children}
    </div>
  );
}
