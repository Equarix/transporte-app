import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import {
  LuBus,
  LuHouse,
  LuImage,
  LuMap,
  LuPlus,
  LuUser,
  LuChartBar,
  LuTag,
} from "react-icons/lu";
import { AiOutlineShop } from "react-icons/ai";
import { GrSchedules } from "react-icons/gr";
interface SideBarConfigProps {
  body: SidebarItemProps[];
  footer: SidebarItemProps[];
}

export const SideBarConfig: SideBarConfigProps = {
  body: [
    {
      label: "Inicio",
      icon: <LuHouse />,
      children: [],
      href: "/",
    },
    {
      label: "Reportes",
      icon: <LuChartBar />,
      children: [
        {
          label: "Reporte de Ventas",
          href: "/reports/sales",
          icon: <LuChartBar />,
          children: [],
        },
        {
          label: "Reporte de Puntos",
          href: "/reports/points",
          icon: <LuChartBar />,
          children: [],
        },
        {
          label: "Ventas por Vendedor",
          href: "/reports/sales-agents",
          icon: <LuChartBar />,
          children: [],
        },
        {
          label: "Rendimiento de Agencias",
          href: "/reports/agencies",
          icon: <LuChartBar />,
          children: [],
        },
        {
          label: "Rutas más Vendidas",
          href: "/reports/routes",
          icon: <LuChartBar />,
          children: [],
        },
      ],
      href: "/reports/sales",
    },
    {
      label: "Promos",
      icon: <LuTag />,
      children: [],
      href: "/promos",
    },
    {
      label: "Destinos",
      icon: <LuMap />,
      children: [
        {
          label: "Lista de destinos",
          href: "/destinations",
          icon: <LuMap />,
          children: [],
        },
        {
          label: "Crear destino",
          href: "/destinations/create",
          icon: <LuPlus />,
          children: [],
        },
      ],
      href: "/destinations",
    },
    {
      label: "Agencias",
      icon: <AiOutlineShop />,
      children: [
        {
          label: "Lista de agencias",
          href: "/agency",
          icon: <LuMap />,
          children: [],
        },
        {
          label: "Crear agencia",
          href: "/agency/create",
          icon: <LuPlus />,
          children: [],
        },
      ],
      href: "/agency",
    },
    {
      label: "Buses",
      icon: <LuBus />,
      children: [
        {
          label: "Lista de buses",
          href: "/bus",
          icon: <LuBus />,
          children: [],
        },
        {
          label: "Crear bus",
          href: "/bus/create",
          icon: <LuPlus />,
          children: [],
        },
      ],
      href: "/bus",
    },
    {
      label: "Programacion",
      href: "/bus/reservers",
      icon: <GrSchedules />,
      children: [
        {
          label: "Lista de programaciones",
          href: "/bus/reservers",
          icon: <GrSchedules />,
          children: [],
        },
        {
          label: "Crear programacion",
          href: "/bus/reservers/create",
          icon: <LuPlus />,
          children: [],
        },
      ],
    },
    {
      label: "Usuarios",
      icon: <LuUser />,
      children: [
        {
          label: "Lista de usuarios",
          href: "/user",
          icon: <LuUser />,
          children: [],
        },
        {
          label: "Crear usuario",
          href: "/user/create",
          icon: <LuPlus />,
          children: [],
        },
      ],
      href: "/user",
    },
    {
      label: "Galeria",
      icon: <LuImage />,
      children: [],
      href: "/galery",
    },
  ],
  footer: [],
};
