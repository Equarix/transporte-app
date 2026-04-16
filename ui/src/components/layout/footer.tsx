import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const CONTACT_INFO = [
  {
    label: "Call Center",
    href: "tel:+5144284644",
    value: "044-284644",
  },
  {
    label: "WhatsApp",
    href: "tel:+5144284644",
    value: "044-284644",
  },
  {
    label: "Servicio de Atención al Cliente",
    href: "tel:+51943777070",
    value: "943777070",
  },
  {
    label: "Tripulante Virtual ARI",
    href: "https://wa.me/51943777070",
    value: "943777070",
  },
];

const LINK_REFERENCE = [
  {
    href: "/trabaja-con-nosotros",
    label: "Trabaja con nosotros",
  },
  {
    href: "/faq",
    label: "FAQ'S",
  },
  {
    href: "/politicas-de-devolucion",
    label: "Politicas de devolucion",
  },
  {
    href: "/terminos-y-condiciones",
    label: "Terminos y condiciones",
  },
  {
    href: "/codigo-etica-conducta",
    label: "Código de ética y conducta",
  },
  {
    href: "/comprobante-electronico",
    label: "Comprobante electrónico",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-orange-400 py-8 px-20 text-white space-y-4">
      <header className="flex flex-col max-w-max">
        <h3 className="text-2xl font-bold">Contactanos</h3>
        <span className="block w-1/3 h-px bg-white" />
      </header>

      <div className="grid grid-cols-3 w-full gap-8">
        <section className="space-y-4">
          <ul className="text-sm space-y-2">
            {CONTACT_INFO.map((i) => (
              <li key={i.label}>
                <span className="font-bold">{i.label}:</span>
                <Link href={i.href}> {i.value}</Link>
              </li>
            ))}
          </ul>

          <footer className="space-y-2">
            <h4 className="font-bold">Siguenos</h4>
            <div className="flex items-center gap-2">
              <Link href="#">
                <FaFacebook className="text-xl" />
              </Link>
              <Link href="#">
                <FaInstagram className="text-xl" />
              </Link>
              <Link href="#">
                <FaTiktok className="text-xl" />
              </Link>
            </div>
          </footer>
        </section>

        <section className="w-full text-sm">
          <ul className="space-y-4">
            <li className="flex flex-col">
              <span className="font-bold">Buzón de atención</span>
              <Link href="mailto:atencionweb@ittsabus.com">
                <span className="font-bold">Email:</span>
                atencionweb@ittsabus.com
              </Link>
            </li>
            <li className="flex flex-col">
              <span className="font-bold">Servicio de Atención al cliente</span>
              <Link href="mailto:sac@ittsabus.com">
                <span className="font-bold">Email SAC:</span>
                sac@ittsabus.com
              </Link>
            </li>

            <li>
              <p className="font-bold">
                Comuníquese con nosotros y lo atenderemos con gusto.
              </p>
            </li>
            <li className="flex flex-col font-bold">
              <p>Razón social</p>
              <p>INTERNACIONAL DE TRANSPORTE TURÍSTICO Y SERVICIOS SRL</p>
            </li>
            <li className="flex flex-col">
              <p>
                <span className="font-bold">RUC:</span>
                20132272418
              </p>
            </li>
          </ul>
        </section>

        <section className="w-full">
          <ul className="text-sm space-y-2">
            {LINK_REFERENCE.map((i) => (
              <li key={i.href}>
                <Link href={i.href}>{i.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="text-white text-xs font-medium">
        <Image src="/logo_white.svg" alt="logo" width={200} height={200} />
        <p className="mt-2">@{new Date().getFullYear()} Ittsa.</p>
        <p>Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
