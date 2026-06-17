"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/modules/auth/UserMenu";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
  {
    href: "/",
    label: "Inicio",
  },
  {
    href: "/sobre-nosotros",
    label: "Sobre Nosotros",
  },
  {
    href: "/servicios",
    label: "Servicios",
  },
  {
    href: "/destinos",
    label: "Destinos",
  },
  {
    href: "/agencias",
    label: "Agencias",
  },
  {
    href: "/contacto",
    label: "Contacto",
  },
];

export default function Header() {
  const url = usePathname();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 border-b border-slate-200">
      <Image src="/logo_new.svg" alt="Logo" width={200} height={200} />
      <nav>
        <ul className="flex items-center gap-8 text-sm ">
          {NAV_LINKS.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className={cn(
                  url === i.href &&
                    "pb-2 border-b-2 border-amber-600 font-bold text-yellow-900",
                )}
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        {mounted && user && <NotificationBell />}
        {mounted && user ? (
          <UserMenu user={user} onLogout={logout} />
        ) : (
          <Link
            href="/auth/login"
            className="px-6 py-2.5 rounded-full bg-amber-600 text-white text-sm font-bold shadow-md hover:bg-amber-700 transition-all hover:scale-105 active:scale-95"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </header>
  );
}
