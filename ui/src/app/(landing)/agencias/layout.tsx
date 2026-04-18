import MapProvider from "@/components/context/map-context/MapContext";
import { ENV } from "@/config/ENV";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <MapProvider apiKey={ENV.GOOGLE_MAPS_API_KEY}>{children}</MapProvider>;
}
