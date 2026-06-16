import { useState } from "react";
import {
  useSalesReport,
  type RecentTransaction,
} from "../hooks/useSalesReport";
import { exportToExcel } from "@/utils/exportUtils";
import {
  LuDollarSign,
  LuTicket,
  LuTrendingUp,
  LuFilter,
  LuDownload,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { Spinner } from "@heroui/react";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";

export default function SalesReportPage() {
  const { data, isLoading } = useSalesReport();
  const [timeframe, setTimeframe] = useState<"monthly" | "weekly" | "daily">(
    "monthly",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (isLoading || !data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner
          size="lg"
          label="Cargando reporte de ventas..."
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

  // Filter transactions based on search
  const filteredSales = data.recentSales.filter((sale) => {
    const term = searchTerm.toLowerCase();
    return (
      sale.bookingId.toLowerCase().includes(term) ||
      sale.customer.toLowerCase().includes(term) ||
      sale.route.toLowerCase().includes(term) ||
      sale.status.toLowerCase().includes(term)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Render status badge helper
  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "APROBADO" || s === "CONFIRMED" || s === "COMPLETED") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30">
          CONFIRMADO
        </span>
      );
    }
    if (s === "PENDIENTE" || s === "PENDING") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30">
          PENDIENTE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/30">
        CANCELADO
      </span>
    );
  };

  // Define columns for Tanstack Table
  const columns: ColumnDef<RecentTransaction>[] = [
    {
      accessorKey: "bookingId",
      header: "ID DE RESERVA",
      cell: ({ row }) => (
        <span className="font-semibold text-amber-700 dark:text-amber-500">
          {row.original.bookingId}
        </span>
      ),
    },
    {
      accessorKey: "route",
      header: "RUTA",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-zinc-900 dark:text-white">
            {row.original.route}
          </span>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mt-0.5">
            {row.original.busClass}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "CLIENTE",
      cell: ({ row }) => (
        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
          {row.original.customer}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "ESTADO",
      cell: ({ row }) => renderStatusBadge(row.original.status),
    },
    {
      accessorKey: "date",
      header: "FECHA",
      cell: ({ row }) => (
        <span className="text-zinc-500 text-sm">
          {new Date(row.original.date).toLocaleDateString("es-PE", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">MONTO</div>,
      cell: ({ row }) => (
        <div className="text-right font-extrabold text-zinc-900 dark:text-white">
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
  ];

  // Max value of trends for chart scaling
  const maxTrendVal = Math.max(
    ...data.trends.map((t) => Math.max(t.direct, t.agencies)),
    100,
  );

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto text-zinc-950 dark:text-zinc-50">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-amber-600 uppercase">
            Resumen de Rendimiento
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-white">
            Reporte General de Ventas
          </h1>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            Seguimiento de trayectorias de ingresos globales y métricas de distribución de pasajes en todos los corredores de tránsito de Entrafesa.
          </p>
        </div>

        {/* Time Switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 self-end md:self-auto">
          {(["monthly", "weekly", "daily"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 capitalize ${
                timeframe === t
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {t === "monthly"
                ? "Mensual"
                : t === "weekly"
                  ? "Semanal"
                  : "Diario"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Revenue */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Ingresos Totales
            </span>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {formatCurrency(data.totalRevenue)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <span className="inline-block transform -rotate-45">→</span>+
              {data.growthRate}% vs año anterior
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center shadow-inner group-hover:scale-115 transition-transform duration-200">
            <LuDollarSign size={22} />
          </div>
        </div>

        {/* Card 2: Tickets Sold */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Pasajes Vendidos
            </span>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {formatNumber(data.ticketsSold)}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-500 mt-2">
              🎫 {data.occupancyRate}% Ocupación Promedio
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center shadow-inner group-hover:scale-115 transition-transform duration-200">
            <LuTicket size={22} />
          </div>
        </div>

        {/* Card 3: Growth Rate */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Tasa de Crecimiento
            </span>
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {data.growthRate}%
            </span>
            <span className="text-xs font-semibold text-zinc-500 mt-2 flex items-center gap-1">
              📈 Crecimiento Constante
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 flex items-center justify-center shadow-inner group-hover:scale-115 transition-transform duration-200">
            <LuTrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* Monthly Sales Trends Chart */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Tendencias de Ventas Mensuales
            </h2>
            <p className="text-xs text-zinc-400">
              Comparación entre canales directos y agencias
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600 inline-block"></span>
              <span className="text-zinc-600 dark:text-zinc-400">
                Ventas Directas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block"></span>
              <span className="text-zinc-600 dark:text-zinc-400">Agencias</span>
            </div>
          </div>
        </div>

        {/* Visual Chart */}
        <div className="w-full h-64 flex items-end gap-4 sm:gap-8 border-b border-zinc-100 dark:border-zinc-800 pb-4 px-2 select-none">
          {data.trends.map((t) => {
            const directHeight = `${Math.max((t.direct / maxTrendVal) * 100, 5)}%`;
            const agencyHeight = `${Math.max((t.agencies / maxTrendVal) * 100, 5)}%`;

            return (
              <div
                key={t.month}
                className="flex-1 flex flex-col items-center gap-3 group h-full justify-end"
              >
                <div className="w-full flex justify-center items-end gap-1.5 h-full relative">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-zinc-900 text-white text-[10px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex flex-col gap-0.5 z-10 whitespace-nowrap">
                    <span className="font-bold">{t.month}</span>
                    <span>Directo: {formatCurrency(t.direct)}</span>
                    <span>Agencia: {formatCurrency(t.agencies)}</span>
                  </div>

                  {/* Direct Sales Bar */}
                  <div
                    style={{ height: directHeight }}
                    className="w-4 sm:w-6 bg-amber-600 rounded-t-md hover:bg-amber-500 transition-all duration-300 cursor-pointer shadow-sm shadow-amber-600/10"
                  />
                  {/* Agency Sales Bar */}
                  <div
                    style={{ height: agencyHeight }}
                    className="w-4 sm:w-6 bg-zinc-200 dark:bg-zinc-800 rounded-t-md hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-300 cursor-pointer shadow-sm"
                  />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                  {t.month.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Transacciones Recientes
            </h2>
            <p className="text-xs text-zinc-400">
              Revisando las últimas 100 operaciones de pasajes
            </p>
          </div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por ID, cliente, ruta..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 md:w-64 text-sm px-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
            <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <LuFilter size={14} />
              Filtrar
            </button>
            <button
              onClick={() => {
                const exportData = data.recentSales.map((s) => ({
                  "Reserva ID": s.bookingId,
                  "Ruta": s.route,
                  "Clase de Bus": s.busClass,
                  "Cliente": s.customer,
                  "Estado": s.status,
                  "Fecha": new Date(s.date).toLocaleDateString("es-PE"),
                  "Monto (USD)": s.amount,
                }));
                exportToExcel(
                  exportData,
                  ["Reserva ID", "Ruta", "Clase de Bus", "Cliente", "Estado", "Fecha", "Monto (USD)"],
                  ["Reserva ID", "Ruta", "Clase de Bus", "Cliente", "Estado", "Fecha", "Monto (USD)"],
                  "Reporte_Ventas_Recientes"
                );
              }}
              className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <LuDownload size={14} />
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Table Content - Refactored to use generic custom Table */}
        <div className="p-2">
          <Table
            data={paginatedSales}
            columns={columns}
            emptyContent="No se encontraron transacciones recientes."
          />
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-zinc-500">
          <span>
            Mostrando {filteredSales.length === 0 ? 0 : startIndex + 1} al{" "}
            {Math.min(startIndex + itemsPerPage, filteredSales.length)} de{" "}
            {formatNumber(filteredSales.length)} registros
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <LuChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === idx + 1
                    ? "bg-amber-600 text-white"
                    : "border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              <LuChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
