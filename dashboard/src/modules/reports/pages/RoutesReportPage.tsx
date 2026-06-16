import { useState } from "react";
import { useRoutesReport, type RoutePerformanceMetric } from "../hooks/useRoutesReport";
import {
  LuTrendingUp,
  LuTrendingDown,
  LuSparkles,
  LuMapPin,
  LuFileSpreadsheet,
  LuArrowRight,
  LuCalendar,
} from "react-icons/lu";
import { Spinner } from "@heroui/react";
import { Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";
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
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
];

interface WindowWithGoogle extends Window {
  google?: typeof google;
}

function DirectionsRoute({ path, color }: { path: google.maps.LatLngLiteral[]; color: string }) {
  const map = useMap();

  useEffect(() => {
    const win = window as WindowWithGoogle;
    if (!map || !win.google) return;

    const directionsService = new win.google.maps.DirectionsService();
    const directionsRenderer = new win.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 4,
      },
    });

    directionsService.route(
      {
        origin: path[0],
        destination: path[1],
        travelMode: win.google.maps.TravelMode.DRIVING,
      },
      (
        result: google.maps.DirectionsResult | null,
        status: "OK" | "INVALID_REQUEST" | "NOT_FOUND" | "OVER_QUERY_LIMIT" | "REQUEST_DENIED" | "UNKNOWN_ERROR" | "ZERO_RESULTS" | "MAX_WAYPOINTS_EXCEEDED"
      ) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
        } else {
          const fallbackPolyline = new win.google!.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 4,
          });
          fallbackPolyline.setMap(map);
        }
      }
    );

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [map, path, color]);

  return null;
}

export default function RoutesReportPage() {
  const { data, isLoading } = useRoutesReport();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading || !data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner
          size="lg"
          label="Cargando reporte de rutas..."
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

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  const totalPages = Math.ceil(data.routes.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoutes = data.routes.slice(startIndex, startIndex + itemsPerPage);

  const columns: ColumnDef<RoutePerformanceMetric>[] = [
    {
      id: "rank",
      header: "RANK",
      cell: ({ row }) => (
        <span className="font-extrabold text-zinc-400 dark:text-zinc-500">
          #{startIndex + row.index + 1}
        </span>
      ),
    },
    {
      id: "route",
      header: "RUTA ORIGEN/DEST",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
            <LuMapPin size={15} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-zinc-900 dark:text-white">
              {row.original.originName} → {row.original.destName}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "passengerVolume",
      header: "VOLUMEN DE PASAJEROS",
      cell: ({ row }) => (
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          {formatNumber(row.original.passengerVolume)} PAX
        </span>
      ),
    },
    {
      accessorKey: "grossProfit",
      header: "GANANCIA BRUTA",
      cell: ({ row }) => (
        <span className="font-extrabold text-zinc-950 dark:text-white">
          {formatCurrency(row.original.grossProfit)}
        </span>
      ),
    },
    {
      accessorKey: "loadFactor",
      header: "FACTOR DE CARGA",
      cell: ({ row }) => (
        <div className="flex flex-col w-32 gap-1.5">
          <span className="text-[10px] font-bold text-zinc-500">{row.original.loadFactor}% Eficiencia</span>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              style={{ width: `${row.original.loadFactor}%` }}
              className="bg-amber-600 h-full rounded-full"
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "trend",
      header: "TENDENCIA",
      cell: ({ row }) => {
        const t = row.original.trend;
        if (t === "UP") {
          return <LuTrendingUp className="text-emerald-600 dark:text-emerald-400" size={18} />;
        }
        if (t === "DOWN") {
          return <LuTrendingDown className="text-rose-600 dark:text-rose-400" size={18} />;
        }
        return <LuArrowRight className="text-zinc-400" size={18} />;
      },
    },
  ];

  const colors = ["#d97706", "#2563eb", "#059669", "#7c3aed", "#db2777"];
  const getRouteColor = (idx: number) => colors[idx % colors.length];

  const uniqueNodes: Record<string, { lat: number; lng: number; name: string }> = {};
  data.routes.forEach((r) => {
    uniqueNodes[r.originName] = { lat: r.originLat, lng: r.originLng, name: r.originName };
    uniqueNodes[r.destName] = { lat: r.destLat, lng: r.destLng, name: r.destName };
  });

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto text-zinc-950 dark:text-zinc-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">
            Cuadro de Mando de Rendimiento
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-white">
            Reporte de Rutas más Vendidas
          </h1>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Análisis completo del volumen de pasajeros, ocupación y rentabilidad de los corredores viales clave.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm bg-white dark:bg-zinc-950">
            <LuCalendar size={14} />
            Últimos 30 Días
          </button>
          <button
            onClick={() => {
              const exportData = data.routes.map((r, idx) => ({
                "Ranking": idx + 1,
                "Origen": r.originName,
                "Destino": r.destName,
                "Volumen Pasajeros": r.passengerVolume,
                "Ganancia Bruta (USD)": r.grossProfit,
                "Factor de Carga (%)": r.loadFactor,
                "Tendencia": r.trend,
              }));
              exportToExcel(
                exportData,
                ["Ranking", "Origen", "Destino", "Volumen Pasajeros", "Ganancia Bruta (USD)", "Factor de Carga (%)", "Tendencia"],
                ["Ranking", "Origen", "Destino", "Volumen Pasajeros", "Ganancia Bruta (USD)", "Factor de Carga (%)", "Tendencia"],
                "Reporte_Rutas_Mas_Vendidas"
              );
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <LuFileSpreadsheet size={15} />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Main Stats / Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Stats Cards */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Revenue KPI */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Ingresos Totales por Ruta
              </span>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {formatCurrency(data.totalRouteRevenue)}
              </span>
              <span className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                <span className="inline-block transform -rotate-45">→</span>+12.5% vs mes anterior
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LuTrendingUp size={20} />
            </div>
          </div>

          {/* Load Factor KPI */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Factor de Carga Promedio
              </span>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {data.avgPassengerLoad}%
              </span>
              <span className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                <span className="inline-block transform -rotate-45">→</span>+4.2% vs mes anterior
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LuSparkles size={20} />
            </div>
          </div>
        </div>

        {/* Right Map */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950 z-20">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">Red de Rutas y Nodos</h2>
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">Visualización en Vivo</span>
            </div>
            <LuMapPin className="text-amber-500" size={18} />
          </div>

          <div className="w-full h-[350px] relative overflow-hidden">
            <Map
              mapId="routes_report_map"
              defaultCenter={{ lat: -9.189967, lng: -75.015152 }}
              defaultZoom={5}
              style={{
                width: "100%",
                height: "100%",
              }}
              disableDefaultUI={true}
              zoomControl={true}
              styles={theme === "dark" ? mapDarkStyle : []}
            >
              {Object.values(uniqueNodes).map((node) => (
                <AdvancedMarker
                  key={node.name}
                  position={{ lat: node.lat, lng: node.lng }}
                  title={node.name}
                >
                  <Pin background="#d97706" borderColor="#ffffff" glyphColor="#ffffff" />
                </AdvancedMarker>
              ))}

              {data.routes.map((route, idx) => {
                const path = [
                  { lat: route.originLat, lng: route.originLng },
                  { lat: route.destLat, lng: route.destLng },
                ];
                return (
                  <DirectionsRoute
                    key={route.routeId}
                    path={path}
                    color={getRouteColor(idx)}
                  />
                );
              })}
            </Map>
          </div>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-950">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">Clasificación de Rendimiento de Rutas</h2>
        </div>

        <div className="p-2">
          <Table
            data={paginatedRoutes}
            columns={columns}
            emptyContent="No se encontraron rutas."
          />
        </div>

        {/* Footer / Pagination */}
        <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-semibold">
          <span>
            Mostrando {data.routes.length === 0 ? 0 : startIndex + 1} al{" "}
            {Math.min(startIndex + itemsPerPage, data.routes.length)} de{" "}
            {formatNumber(data.routes.length)} rutas activas
          </span>
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-100 dark:border-zinc-900 select-none">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold transition-all ${
                  currentPage === idx + 1
                    ? "bg-amber-500 text-white"
                    : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
