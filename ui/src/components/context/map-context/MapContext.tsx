"use client";

import { PropsWithChildren } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

interface MapProviderProps {
  apiKey?: string;
}

export default function MapProvider({
  children,
  apiKey,
}: PropsWithChildren<MapProviderProps>) {
  return <APIProvider apiKey={apiKey || ""}>{children}</APIProvider>;
}
