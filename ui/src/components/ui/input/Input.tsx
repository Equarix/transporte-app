"use client";

import { cn } from "@/utils/cn";
import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className, type, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const currentType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-[11px] font-extrabold text-[#5D4037] uppercase tracking-widest ml-1 opacity-80">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center gap-4 bg-[#F2F2F2] w-full px-7 rounded-[40px] h-13.75 transition-all focus-within:ring-2 focus-within:ring-[#5D4037]/10",
            error && "ring-2 ring-red-500/50 bg-red-50/50",
            className,
          )}
        >
          {icon && (
            <div className="text-[#8B7E74] shrink-0 text-2xl">{icon}</div>
          )}
          <input
            ref={ref}
            type={currentType}
            className="bg-transparent border-none outline-none w-full text-[#333333] placeholder:text-[#999999] font-medium"
            {...props}
          />
          {isPasswordType && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-[#8B7E74] hover:text-[#5D4037] transition-colors shrink-0"
            >
              {showPassword ? (
                <LuEyeOff className="text-2xl" />
              ) : (
                <LuEye className="text-2xl" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-4">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
