"use client";
import { ResponseAgency } from "@/interface/response.interface";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { LuMoveRight } from "react-icons/lu";

interface MapDetails {
  agency: ResponseAgency;
}

export default function MapDetails({ agency }: MapDetails) {
  return (
    <article className="col-span-4 sticky top-24 self-start flex flex-col gap-4">
      <div className="w-full h-[320px] rounded-4xl overflow-hidden shadow-xl border-4 border-white">
        <Map
          defaultZoom={15}
          mapId="ad879a2c7b14f21082eeb6bc"
          defaultCenter={{
            lat: parseFloat(agency.lat),
            lng: parseFloat(agency.lng),
          }}
          disableDefaultUI={true}
        >
          <AdvancedMarker
            position={{
              lat: parseFloat(agency.lat),
              lng: parseFloat(agency.lng),
            }}
          />
        </Map>
      </div>
      <Link
        href={`https://www.google.com/maps/dir/?api=1&destination=${agency.lat},${agency.lng}`}
        target="_blank"
        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 border border-slate-200 transition-colors"
      >
        Cómo llegar <LuMoveRight />
      </Link>
    </article>
  );
}
