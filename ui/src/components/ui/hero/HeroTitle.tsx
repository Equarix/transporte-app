import { cn } from "@/utils/cn";
import { PropsWithChildren } from "react";

interface HeroTitleProps extends PropsWithChildren {
  className?: string;
}

export default function HeroTitle({ children, className }: HeroTitleProps) {
  return <h1 className={cn("text-6xl font-bold", className)}>{children}</h1>;
}
