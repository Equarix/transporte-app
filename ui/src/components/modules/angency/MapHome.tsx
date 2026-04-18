"use client";

import { ResponseAgency } from "@/interface/response.interface";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { LuLocate } from "react-icons/lu";

interface MapHome {
  agency: ResponseAgency[];
}

export default function MapHome({ agency }: MapHome) {
  const [center, setCenter] = useState({
    lat: -8.095173513477986,
    lng: -79.03919892262647,
  });
  const [zoom, setZoom] = useState(15);

  const getCurrentPosition = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoom(15);
        },
        (error) => {
          console.error(error);
        },
      );
    }
  };

  return (
    <div className="w-full min-h-[480px] flex flex-col relative rounded-4xl overflow-hidden">
      <header className="absolute top-8 mx-8 z-10">
        <nav className="w-full p-6 space-y-2 rounded-4xl bg-white/50 backdrop-blur-sm">
          <h3 className="font-bold">Ubica tu sede</h3>
          <p>
            Mapa interactivo con 15 sedes a nivel nacional. Selecciona una para
            ver horarios y servicios.
          </p>
        </nav>
      </header>

      <Map
        defaultZoom={10}
        mapId="ad879a2c7b14f21082eeb6bc"
        style={{
          height: "600px",
        }}
        disableDefaultUI={true}
        center={center}
        onCameraChanged={(e) => {
          setCenter(e.detail.center);
          setZoom(e.detail.zoom);
        }}
        zoom={zoom}
      >
        {agency.map((i) => (
          <AdvancedMarker
            key={i.agencyId}
            position={{ lat: parseFloat(i.lat), lng: parseFloat(i.lng) }}
          />
        ))}

        <AdvancedMarker position={{ lat: center.lat, lng: center.lng }} />
      </Map>

      <footer className="absolute bottom-8 mx-8 z-10">
        <button
          onClick={getCurrentPosition}
          className="w-full py-4 text-white font-bold bg-orange-500 rounded-2xl flex items-center gap-2 px-4"
        >
          <LuLocate />
          <p>Encuentra tu sede más cercana</p>
        </button>
      </footer>
    </div>
  );
}
