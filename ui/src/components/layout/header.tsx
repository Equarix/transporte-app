"use client";
import Link from "next/link";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

      <Link
        href="/auth/login"
        className="px-4 py-2 rounded-full bg-amber-600 text-white text-sm"
      >
        Iniciar Sesión
      </Link>
    </header>
  );
}
