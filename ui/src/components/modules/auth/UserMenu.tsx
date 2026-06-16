"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuUser, LuLogOut, LuSettings, LuTicket } from "react-icons/lu";
import Link from "next/link";
import { AuthResponse } from "@/interface/response.interface";

interface MenuOption {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const MENU_OPTIONS: MenuOption[] = [
  {
    label: "Mi Perfil",
    icon: <LuUser />,
    href: "/perfil?tab=profile",
  },
  {
    label: "Mis Reservas",
    icon: <LuTicket />,
    href: "/perfil?tab=tickets",
  },
  {
    label: "Configuración",
    icon: <LuSettings />,
    href: "/perfil?tab=settings",
  },
];

interface UserMenuProps {
  user: AuthResponse;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fullName = `${user.profile.firstName} ${user.profile.lastName}`;
  const initial = user.profile.firstName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#F2F2F2] hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#5D4037]/10"
      >
        <div className="size-9 rounded-full bg-[#5D4037] flex items-center justify-center text-white text-base font-bold shadow-sm">
          {initial}
        </div>
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-sm font-extrabold text-[#333333]">
            {user.profile.firstName}
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 p-2"
          >
            <div className="px-5 py-4 border-b border-gray-50 mb-2">
              <p className="text-[10px] font-extrabold text-[#5D4037] uppercase tracking-widest opacity-60 mb-1">
                Sesión Iniciada
              </p>
              <p className="text-base font-bold text-[#333333] truncate">
                {fullName}
              </p>
              <p className="text-xs text-[#8B7E74] truncate font-medium">
                {user.profile.email}
              </p>
            </div>

            <div className="space-y-1">
              {MENU_OPTIONS.map((option, index) => (
                <motion.div
                  key={option.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    href={option.href}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-[#5D4037] hover:bg-[#F2F2F2] transition-all group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      {option.icon}
                    </span>
                    {option.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-50">
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: MENU_OPTIONS.length * 0.04 }}
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
              >
                <span className="text-xl group-hover:rotate-12 transition-transform">
                  <LuLogOut />
                </span>
                Cerrar Sesión
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
