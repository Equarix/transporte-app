import { cn } from "@/utils/cn";
import { PropsWithChildren } from "react";

interface HeroCaptionProps extends PropsWithChildren {
  className?: string;
}

export default function HeroCaption({ children, className }: HeroCaptionProps) {
  return (
    <article className={cn("flex flex-col gap-4", className)}>
      {children}
    </article>
  );
}
