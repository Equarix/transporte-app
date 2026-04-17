import { GenericProps } from "@/interface/utils.interface";
import { cn } from "@/utils/cn";

export default function CardBody({ children, className }: GenericProps) {
  return (
    <div className={cn("p-6 flex flex-col gap-6", className)}>{children}</div>
  );
}
