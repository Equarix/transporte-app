import { type PropsWithChildren, useMemo } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

interface MapProviderProps {
  apiKey?: string;
}

export default function MapProvider({
  children,
  apiKey,
}: PropsWithChildren<MapProviderProps>) {
  const places = useMemo(() => ["places"], []);

  return (
    <APIProvider apiKey={apiKey || ""} libraries={places}>
      {children}
    </APIProvider>
  );
}
