import { cn } from "@/utils/cn";
import { PropsWithChildren } from "react";

interface HeroDescripcion extends PropsWithChildren {
  className?: string;
}

export default function HeroDescripcion({
  children,
  className,
}: HeroDescripcion) {
  return (
    <p
      className={cn(
        "text-lg font-medium text-[#564336] max-w-[512px]",
        className,
      )}
    >
      {children}
    </p>
  );
}
