import { useState } from "react";
import { usePointsReport, type TopMember } from "../hooks/usePointsReport";
import { exportToExcel } from "@/utils/exportUtils";
import {
  LuAward,
  LuSparkles,
  LuTrendingUp,
  LuDownload,
  LuPlus,
  LuArrowRight,
  LuCoins,
} from "react-icons/lu";
import { Spinner } from "@heroui/react";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";

export default function PointsReportPage() {
  const { data, isLoading } = usePointsReport();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading || !data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner
          size="lg"
          label="Cargando reporte de puntos..."
          color="primary"
        />
      </div>
    );
  }

  // Formatting helpers
  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  // Pagination calculations
  const totalPages = Math.ceil(data.topMembers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = data.topMembers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Render tier badge helper
  const renderTierBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "DIAMOND") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20 uppercase shadow-sm">
          ❖ Diamante
        </span>
      );
    }
    if (s === "PLATINUM") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20 uppercase shadow-sm">
          ✦ Platino
        </span>
      );
    }
    if (s === "GOLD") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-500/20 uppercase shadow-sm">
          ★ Oro
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-zinc-500/10 text-zinc-500 dark:bg-zinc-500/20 dark:text-zinc-400 border border-zinc-500/20 uppercase shadow-sm">
        Plata
      </span>
    );
  };

  // Define columns for Tanstack Table
  const columns: ColumnDef<TopMember>[] = [
    {
      id: "traveler",
      header: "VIAJERO",
      cell: ({ row }) => {
        const initials = row.original.customer
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("");
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-xs select-none">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-zinc-900 dark:text-white">
                {row.original.customer}
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                {row.original.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "ESTADO / NIVEL",
      cell: ({ row }) => renderTierBadge(row.original.status),
    },
    {
      accessorKey: "pointBalance",
      header: "BALANCE DE PUNTOS",
      cell: ({ row }) => (
        <span className="font-extrabold text-zinc-800 dark:text-zinc-200">
          {formatNumber(row.original.pointBalance)} PTS
        </span>
      ),
    },
    {
      accessorKey: "velocity",
      header: "VELOCIDAD",
      cell: ({ row }) => {
        const vel = row.original.velocity;
        const isPositive = vel.startsWith("+");
        const isNegative = vel.startsWith("-");

        return (
          <span
            className={`text-xs font-bold ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : isNegative
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-zinc-400"
            }`}
          >
            {vel}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">ACCIONES</div>,
      cell: () => (
        <div className="text-right">
          <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            <LuPlus size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto text-zinc-950 dark:text-zinc-50">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">
          Reportes de Lealtad
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-white">
          Reporte de Puntos por Usuario
        </h1>
        <p className="text-sm text-zinc-500 mt-1 max-w-xl">
          Visualización de analíticas del programa de lealtad, velocidades de
          acumulación de puntos y tendencias de canje en la red Horizon.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Issued */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Emitido
            </span>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {formatNumber(data.totalIssued)}{" "}
              <span className="text-sm font-bold text-zinc-400">PTS</span>
            </span>
            <span className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <span className="inline-block transform -rotate-45">→</span>+12.4%
              vs año anterior
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-200">
            <LuCoins size={22} />
          </div>
        </div>

        {/* Card 2: Total Redeemed */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Total Canjeado
            </span>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {formatNumber(data.totalRedeemed)}{" "}
              <span className="text-sm font-bold text-zinc-400">PTS</span>
            </span>
            <span className="text-xs font-semibold text-rose-600 mt-2">
              ⇄ {data.redemptionRate}.1% Tasa de Canje
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-200">
            <LuAward size={22} />
          </div>
        </div>

        {/* Card 3: Active Members */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Miembros Horizon Activos
            </span>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {formatNumber(data.activeMembers)}
            </span>
            <span className="text-xs font-semibold text-zinc-400 mt-2 flex items-center gap-1">
              ⏱ Última sinc.: hace 2 minutos
            </span>
          </div>
          <div className="flex items-center">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-2.5 overflow-hidden">
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-950 bg-amber-500 text-white flex items-center justify-center font-bold text-[10px]">
                MS
              </div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-950 bg-sky-500 text-white flex items-center justify-center font-bold text-[10px]">
                AV
              </div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-950 bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                RP
              </div>
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-950 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] flex items-center justify-center font-bold">
                +14k
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Program Velocity (Left) + Top Members Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column Cards */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Program Velocity Card */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Velocidad del Programa
              </h2>
              <LuTrendingUp className="text-amber-500" size={18} />
            </div>

            {/* Accumulation Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span>ACUMULACIÓN</span>
                <span>{data.accumulationRate}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${data.accumulationRate}%` }}
                  className="bg-amber-500 h-full rounded-full"
                />
              </div>
            </div>

            {/* Redemption Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span>CANJE</span>
                <span>{data.redemptionRate}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${data.redemptionRate}%` }}
                  className="bg-orange-800 dark:bg-orange-600 h-full rounded-full"
                />
              </div>
            </div>

            {/* Program Velocity Quote */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 italic leading-relaxed">
              "Los miembros acumulan puntos 1.8 veces más rápido de lo que los
              canjean, lo que sugiere un alto valor percibido a futuro del
              programa de lealtad."
            </div>
          </div>

          {/* Program Expansion Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-md border border-amber-600/20 p-6 flex flex-col items-center text-center gap-4 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-120 transition-transform duration-300" />
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shadow-lg backdrop-blur-md">
              <LuSparkles className="text-white animate-pulse" size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                Expansión del Programa
              </h3>
              <p className="text-xs text-white/80 mt-1 max-w-[220px] mx-auto leading-relaxed">
                Nuevos niveles y beneficios exclusivos para nuestros viajeros
                elite Horizon en el próximo trimestre.
              </p>
            </div>
            <button className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition-all border border-white/25">
              Ver Mapa de Ruta
              <LuArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Top Members Table */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden lg:col-span-2">
          {/* Table Header */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Miembros Horizon Destacados
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Clasificados por su balance actual de puntos acumulados
              </p>
            </div>
            <button
              onClick={() => {
                const exportData = data.topMembers.map((m) => ({
                  "ID Usuario": m.userId,
                  "Cliente": m.customer,
                  "Email": m.email,
                  "Balance Puntos": m.pointBalance,
                  "Nivel": m.status,
                  "Velocidad": m.velocity,
                }));
                 exportToExcel(
                   exportData,
                   ["ID Usuario", "Cliente", "Email", "Balance Puntos", "Nivel", "Velocidad"],
                   ["ID Usuario", "Cliente", "Email", "Balance Puntos", "Nivel", "Velocidad"],
                   "Reporte_Miembros_Horizon"
                 );
              }}
              className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm bg-white dark:bg-zinc-950"
            >
              <LuDownload size={14} />
              Exportar Excel
            </button>
          </div>

          {/* Table Content */}
          <div className="p-2">
            <Table
              data={paginatedMembers}
              columns={columns}
              emptyContent="No se encontraron miembros registrados."
            />
          </div>

          {/* Table Footer */}
          <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-semibold">
            <span>
              Mostrando {data.topMembers.length === 0 ? 0 : startIndex + 1} al{" "}
              {Math.min(startIndex + itemsPerPage, data.topMembers.length)} de{" "}
              {formatNumber(data.topMembers.length)} resultados
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

      {/* Bottom Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800/60 shadow-md p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
        {/* Decorative background image overlay */}
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay filter grayscale group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-800/20 mix-blend-multiply pointer-events-none" />

        <div className="flex flex-col gap-3 max-w-2xl z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Recompensa a tus viajeros Horizon más leales hoy.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Nuestros análisis demuestran que el canje inmediato de recompensas
            aumenta el valor de vida del cliente hasta en un 24% en el sector
            del transporte.
          </p>
        </div>

        <div className="flex items-center gap-4 z-10 w-full md:w-auto shrink-0">
          <button className="w-full md:w-auto px-6 py-3 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-extrabold rounded-xl transition-all shadow-sm">
            Generar Promo
          </button>
          <button className="w-full md:w-auto px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-white text-xs font-extrabold rounded-xl transition-all">
            Saber Más
          </button>
        </div>
      </div>
    </div>
  );
}
