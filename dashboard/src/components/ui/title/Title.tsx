import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  component?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
}

export default function Title({
  component: Component = "h1",
  className,
  children,
  ...rest
}: TitleProps) {
  return (
    <Component
      className={cn(`text-2xl font-bold dark:text-white mb-4`, className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
