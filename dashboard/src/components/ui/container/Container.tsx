import { cn } from "@/utils/cn";
import type { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("flex flex-col p-4 h-full w-full", className)}
      {...props}
    />
  );
}
