import type { SidebarItemProps } from "@/components/layouts/Sidebar/SidebarItem";
import { LuBus, LuHouse, LuImage, LuMap, LuPlus } from "react-icons/lu";
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
      ],
      href: "/bus",
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
