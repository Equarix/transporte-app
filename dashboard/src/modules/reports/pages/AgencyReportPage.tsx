import { useState } from "react";
import { useAgencyReport } from "../hooks/useAgencyReport";
import {
  LuMapPin,
  LuFileSpreadsheet,
} from "react-icons/lu";
import { Spinner } from "@heroui/react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import { exportToExcel } from "@/utils/exportUtils";

const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export default function AgencyReportPage() {
  const { data, isLoading } = useAgencyReport();
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  if (isLoading || !data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner
          size="lg"
          label="Cargando reporte de agencias..."
          color="primary"
        />
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Max value of chart actuals/targets for visual scaling
  const maxVal = Math.max(
    ...data.chartData.map((d) => Math.max(d.actual, d.target)),
    1000,
  );

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto text-zinc-950 dark:text-zinc-50">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">
            Métricas de Rendimiento Interno
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-white">
            Reporte de Rendimiento de Agencias
          </h1>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Análisis comparativo de las agencias de pasajes físicas del norte del Perú y seguimiento de objetivos regionales.
          </p>
        </div>
        <button
          onClick={() => {
            const exportData = data.agencies.map((a) => ({
              "Agencia": a.name,
              "Dirección": a.address,
              "Pasajes Vendidos": a.ticketsSold,
              "Tasa de Conversión (%)": a.conversionRate,
              "Ingresos (USD)": a.revenue,
              "Objetivo (USD)": a.target,
              "Estado": a.targetMeta,
            }));
            exportToExcel(
              exportData,
              ["Agencia", "Dirección", "Pasajes Vendidos", "Tasa de Conversión (%)", "Ingresos (USD)", "Objetivo (USD)", "Estado"],
              ["Agencia", "Dirección", "Pasajes Vendidos", "Tasa de Conversión (%)", "Ingresos (USD)", "Objetivo (USD)", "Estado"],
              "Reporte_Rendimiento_Agencias"
            );
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <LuFileSpreadsheet size={15} />
          Exportar Excel
        </button>
      </div>

      {/* Top Section: Sales vs Targets */}
      <div className="grid grid-cols-1 gap-8 items-start">
        {/* Sales vs Targets Chart */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">Rendimiento de Ventas vs. Objetivos</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Ventas físicas agregadas en los 14 terminales principales</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 block" />
                <span className="text-zinc-500 dark:text-zinc-400">REAL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 block" />
                <span className="text-zinc-500 dark:text-zinc-400">OBJETIVO</span>
              </div>
            </div>
          </div>

          {/* Graphical Bars Container */}
          <div className="w-full h-52 flex items-end gap-3 sm:gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-4 px-2 select-none">
            {data.chartData.map((city) => {
              const actualPct = `${Math.max((city.actual / maxVal) * 100, 5)}%`;
              const targetPct = `${Math.max((city.target / maxVal) * 100, 5)}%`;

              return (
                <div key={city.name} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div className="w-full flex justify-center items-end h-full relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-zinc-900 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col gap-0.5 z-10 whitespace-nowrap">
                      <span className="font-bold">{city.name}</span>
                      <span>Real: {formatCurrency(city.actual)}</span>
                      <span>Objetivo: {formatCurrency(city.target)}</span>
                    </div>

                    {/* Target Bar (Background, light gray) */}
                    <div
                      style={{ height: targetPct }}
                      className="w-full max-w-[40px] bg-zinc-100 dark:bg-zinc-900 rounded-t-lg absolute bottom-0 z-0 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors"
                    />

                    {/* Actual Bar (Foreground, orange-amber) */}
                    <div
                      style={{ height: actualPct }}
                      className="w-full max-w-[40px] bg-amber-600 hover:bg-amber-500 rounded-t-lg z-10 cursor-pointer transition-all shadow-sm shadow-amber-600/10"
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {city.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Map (Left) & Agency Breakdown Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Map Container */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950 z-20">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">Densidad Regional</h2>
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">Territorio Costa Norte</span>
            </div>
            <LuMapPin className="text-amber-500" size={18} />
          </div>

          {/* Interactive Google Map */}
          <div className="w-full h-[320px] relative overflow-hidden">
            <Map
              mapId="agency_report_map"
              defaultCenter={{ lat: -7.8, lng: -79.5 }}
              defaultZoom={6.5}
              style={{
                width: "100%",
                height: "100%",
              }}
              disableDefaultUI={true}
              zoomControl={true}
              styles={theme === "dark" ? mapDarkStyle : []}
            >
              {data.agencies.map((agency) => {
                const color = agency.targetMeta === "ON TRACK" 
                  ? "#10b981" // green
                  : agency.targetMeta === "RISK" 
                    ? "#ef4444" // red
                    : "#f59e0b"; // yellow/orange

                return (
                  <AdvancedMarker
                    key={agency.agencyId}
                    position={{ lat: agency.lat, lng: agency.lng }}
                    title={agency.name}
                  >
                    <Pin background={color} borderColor="#ffffff" glyphColor="#ffffff" />
                  </AdvancedMarker>
                );
              })}
            </Map>
          </div>
        </div>

        {/* Agency Breakdown */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950 z-20">
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">Desglose de Agencias</h2>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[10px] font-extrabold text-amber-600 hover:text-amber-500 uppercase tracking-wider"
            >
              {showAll ? "Ver Menos" : "Ver Todo"}
            </button>
          </div>

          {/* List layout as requested by mockup */}
          <div className="flex flex-col">
            {(showAll ? data.agencies : data.agencies.slice(0, 5)).map((agency) => {
              const salesPercent = Math.min(Math.round((agency.revenue / agency.target) * 100), 100);
              const color = agency.targetMeta === "ON TRACK" 
                ? "bg-emerald-500" 
                : agency.targetMeta === "RISK" 
                  ? "bg-rose-500" 
                  : "bg-amber-500";

              const textClass = agency.targetMeta === "ON TRACK"
                ? "text-emerald-600 dark:text-emerald-400"
                : agency.targetMeta === "RISK"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-amber-600 dark:text-amber-400";

              return (
                <div key={agency.agencyId} className="p-5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                      <LuMapPin size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">{agency.name}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">{agency.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-extrabold text-zinc-400 uppercase">Conversión</span>
                      <span className="font-bold text-sm text-zinc-900 dark:text-white mt-0.5">{agency.conversionRate}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-extrabold text-zinc-400 uppercase">Ingresos</span>
                      <span className="font-extrabold text-sm text-zinc-900 dark:text-white mt-0.5">{formatCurrency(agency.revenue)}</span>
                    </div>
                    <div className="flex flex-col w-20 items-end">
                      <span className={`text-[9px] font-extrabold uppercase ${textClass}`}>{agency.targetMeta}</span>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div style={{ width: `${salesPercent}%` }} className={`h-full rounded-full ${color}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
