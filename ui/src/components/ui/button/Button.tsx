import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon?: boolean;
}

export default function Button({ className, icon, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        className,
        icon && "flex items-center justify-center gap-2",

        "p-5 rounded-full w-full",
      )}
      {...props}
    />
  );
}
