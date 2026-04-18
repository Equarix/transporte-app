import { GenericProps } from "@/interface/utils.interface";
import { cn } from "@/utils/cn";

interface BadgeProps extends GenericProps {
  color?: "orange" | "green";
}

export default function Badge({ children, className, color }: BadgeProps) {
  const colorMap = {
    orange: "border-orange-500 text-orange-500 bg-orange-500/10",
    green: "border-green-500 text-green-500 bg-green-500/10",
  };

  return (
    <span
      className={cn(
        "block px-4 py-1 rounded-full font-semibold border max-w-max",
        colorMap[color ?? "orange"],
        className,
      )}
    >
      {children}
    </span>
  );
}
