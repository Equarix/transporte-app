import { useState } from "react";
import {
  useSalesAgentReport,
  type AgentSalesMetric,
} from "../hooks/useSalesAgentReport";
import { exportToExcel } from "@/utils/exportUtils";
import {
  LuAward,
  LuTrendingUp,
  LuPercent,
  LuSparkles,
  LuCoins,
} from "react-icons/lu";
import { Spinner } from "@heroui/react";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";

export default function SalesAgentReportPage() {
  const { data, isLoading } = useSalesAgentReport();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading || !data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner
          size="lg"
          label="Cargando reporte de agentes..."
          color="primary"
        />
      </div>
    );
  }

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  // Pagination calculations
  const totalPages = Math.ceil(data.agents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = data.agents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Render status badge helper
  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "ON TRACK" || s === "ON_TRACK") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30 uppercase">
          En Curso
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30 uppercase">
        Revisión
      </span>
    );
  };

  // Define columns for Tanstack Table
  const columns: ColumnDef<AgentSalesMetric>[] = [
    {
      id: "agent",
      header: "NOMBRE DEL AGENTE",
      cell: ({ row }) => {
        const initials = row.original.name
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
                {row.original.name}
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                {row.original.terminalName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tickets",
      header: "PASAJES",
      cell: ({ row }) => (
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
          {formatNumber(row.original.tickets)}
        </span>
      ),
    },
    {
      accessorKey: "convRate",
      header: "TASA DE CONV.",
      cell: ({ row }) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {row.original.convRate}%
        </span>
      ),
    },
    {
      accessorKey: "commission",
      header: "COMISIÓN",
      cell: ({ row }) => (
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          {formatCurrency(row.original.commission)}
        </span>
      ),
    },
    {
      accessorKey: "totalSales",
      header: "VENTAS TOTALES",
      cell: ({ row }) => (
        <span className="font-extrabold text-zinc-900 dark:text-white">
          {formatCurrency(row.original.totalSales)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "ESTADO",
      cell: ({ row }) => renderStatusBadge(row.original.status),
    },
  ];

  const topThree = data.agents.slice(0, 3);

  // Total commissions sum for payout queue
  const totalCommissionsSum = data.agents.reduce(
    (sum, a) => sum + a.commission,
    0,
  );

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto text-zinc-950 dark:text-zinc-50">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">
            Rendimiento del Personal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-white">
            Reporte de Ventas por Usuario
          </h1>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Seguimiento de ingresos generados por canal físico y rendimiento de
            agentes de ventas en ventanilla.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            Filtrar Vista
          </button>
          <button
            onClick={() => {
              const exportData = data.agents.map((a) => ({
                "Agente": a.name,
                "Terminal": a.terminalName,
                "Boletos Vendidos": a.tickets,
                "Tasa de Conversión (%)": a.convRate,
                "Comisión (USD)": a.commission,
                "Ventas Totales (USD)": a.totalSales,
                "Estado": a.status,
              }));
              exportToExcel(
                exportData,
                ["Agente", "Terminal", "Boletos Vendidos", "Tasa de Conversión (%)", "Comisión (USD)", "Ventas Totales (USD)", "Estado"],
                ["Agente", "Terminal", "Boletos Vendidos", "Tasa de Conversión (%)", "Comisión (USD)", "Ventas Totales (USD)", "Estado"],
                "Reporte_Ventas_Agentes"
              );
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Revenue */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Ingresos de Ventas
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {formatCurrency(data.totalSalesRevenue)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <span className="inline-block transform -rotate-45">→</span>+12.5%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <LuTrendingUp size={20} />
          </div>
        </div>

        {/* Card 2: Tickets */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Boletos Vendidos
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {formatNumber(data.ticketsSold)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <span className="inline-block transform -rotate-45">→</span>+4.2%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <LuCoins size={20} />
          </div>
        </div>

        {/* Card 3: Commission */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Comisión Promedio / Agente
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {formatCurrency(data.avgCommission)}
            </span>
            <span className="text-xs font-semibold text-zinc-400 mt-2">
              Estable
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <LuAward size={20} />
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Tasa de Conversión
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {data.conversionRate}%
            </span>
            <span className="text-xs font-semibold text-rose-600 mt-2">
              -2.1%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <LuPercent size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Top Performers (Left) + Commission Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Top Performing Agents */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm lg:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                Mejores Agentes de Ventas
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Clasificados por ingresos totales generados
              </p>
            </div>
            <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="w-7 h-7 rounded-md bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm text-zinc-800 dark:text-white cursor-pointer select-none">
                📊
              </span>
              <span className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer select-none">
                ☰
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {topThree.map((agent, index) => {
              const initials = agent.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("");
              return (
                <div
                  key={agent.userId}
                  className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 flex items-center justify-between hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-sm select-none">
                        {initials}
                      </div>
                      <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-zinc-950">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">
                        {agent.name}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider mt-0.5">
                        {agent.terminalName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="flex flex-col gap-1.5 w-24">
                      <div className="flex justify-between text-[10px] font-extrabold text-zinc-400">
                        <span>CONVERSIÓN</span>
                        <span>{agent.convRate}%</span>
                      </div>
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${agent.convRate}%` }}
                          className="bg-amber-500 h-full rounded-full"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-extrabold text-zinc-400">
                        INGRESOS
                      </span>
                      <span className="font-extrabold text-sm text-zinc-900 dark:text-white mt-0.5">
                        {formatCurrency(agent.totalSales)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Commission Structure & Payout Queue */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Commission Card */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col gap-6">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">
              Estructura de Comisión
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                  <LuPercent size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400 font-extrabold uppercase">
                    Tasa Estándar
                  </span>
                  <span className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200 mt-0.5">
                    2.5% de la Base del Pasaje
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                  <LuAward size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400 font-extrabold uppercase">
                    Nivel de Bono
                  </span>
                  <span className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200 mt-0.5">
                    +$500 por Ventas {">"} $25k
                  </span>
                </div>
              </div>
            </div>

            {/* Payout Queue card nested */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 flex flex-col gap-3 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase">
                    Cola de Pagos
                  </span>
                  <span className="font-extrabold text-2xl text-zinc-900 dark:text-white mt-1">
                    {formatCurrency(totalCommissionsSum)}
                  </span>
                </div>
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 uppercase">
                  Vence 05 Nov
                </span>
              </div>
              <button className="w-full mt-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold rounded-xl transition-all shadow-sm">
                Revisar Todos los Pagos
              </button>
            </div>

            {/* Tip card */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-700 dark:text-amber-500 flex items-start gap-2.5 leading-relaxed">
              <LuSparkles
                className="shrink-0 text-amber-500 mt-0.5 animate-pulse"
                size={15}
              />
              <span>
                <strong>HORIZON PRO TIP:</strong> Los agentes que utilizan
                enlaces de pago móvil muestran una conversión un 15% superior.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Full Sales Breakdown */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">
              Desglose General de Ventas
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Listado detallado del rendimiento de todos los agentes activos
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
            <span>Ordenar por: Ventas</span>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-2">
          <Table
            data={paginatedAgents}
            columns={columns}
            emptyContent="No se encontraron agentes registrados."
          />
        </div>

        {/* Table Footer */}
        <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-semibold">
          <span>
            Mostrando {data.agents.length === 0 ? 0 : startIndex + 1} al{" "}
            {Math.min(startIndex + itemsPerPage, data.agents.length)} de{" "}
            {formatNumber(data.agents.length)} agentes activos
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
