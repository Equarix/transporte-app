import { useState, useMemo } from "react";
import { Button, Spinner, Chip } from "@heroui/react";
import { LuPlus, LuSearch, LuTag, LuPercent, LuGift } from "react-icons/lu";
import Container from "@/components/ui/container/Container";
import Header from "@/components/layouts/header/Header";
import { usePromos } from "../hooks/usePromos";
import { PromoCard } from "../components/PromoCard";
import { PromoFormModal } from "../components/PromoFormModal";
import { DeletePromoModal } from "../components/DeletePromoModal";
import { PromoStatus, PromoType, type Promo } from "../types/promo.types";

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm p-5">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PromosPage() {
  const { promos, isLoading } = usePromos();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PromoStatus | "TODOS">(
    "TODOS",
  );
  const [filterType, setFilterType] = useState<PromoType | "TODOS">("TODOS");

  const [editingPromo, setEditingPromo] = useState<Promo | undefined>(
    undefined,
  );
  const [deletingPromo, setDeletingPromo] = useState<Promo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ─── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const active = promos.filter(
      (p) => p.status === PromoStatus.ACTIVO,
    ).length;
    const discounts = promos.filter(
      (p) => p.promoType === PromoType.DESCUENTO,
    ).length;
    const gifts = promos.filter(
      (p) => p.promoType === PromoType.REGALO,
    ).length;
    const totalUses = promos.reduce((acc, p) => acc + p.totalUses, 0);
    return { active, discounts, gifts, totalUses };
  }, [promos]);

  // ─── Filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return promos.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term);
      const matchesStatus =
        filterStatus === "TODOS" || p.status === filterStatus;
      const matchesType =
        filterType === "TODOS" || p.promoType === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [promos, search, filterStatus, filterType]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingPromo(undefined);
    setIsFormOpen(true);
  };

  const openEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPromo(undefined);
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner size="lg" label="Cargando promociones..." color="secondary" />
      </div>
    );
  }

  return (
    <Container className="space-y-6">
      {/* Header */}
      <Header
        text={{ header: "Gestión de Promos", button: "Nueva promo" }}
        icon={<LuPlus />}
        onClick={openCreate}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Promos activas"
          value={kpis.active}
          icon={<LuTag size={22} className="text-violet-500" />}
          color="bg-violet-100 dark:bg-violet-500/15"
        />
        <KpiCard
          label="Descuentos"
          value={kpis.discounts}
          icon={<LuPercent size={22} className="text-sky-500" />}
          color="bg-sky-100 dark:bg-sky-500/15"
        />
        <KpiCard
          label="Regalos"
          value={kpis.gifts}
          icon={<LuGift size={22} className="text-amber-500" />}
          color="bg-amber-100 dark:bg-amber-500/15"
        />
        <KpiCard
          label="Canjes totales"
          value={kpis.totalUses.toLocaleString("es-PE")}
          icon={<LuTag size={22} className="text-emerald-500" />}
          color="bg-emerald-100 dark:bg-emerald-500/15"
        />
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <LuSearch
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            id="promo-search"
            type="text"
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-colors"
          />
        </div>

        {/* Status filter */}
        <select
          id="promo-filter-status"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as PromoStatus | "TODOS")
          }
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
        >
          <option value="TODOS">Todos los estados</option>
          <option value={PromoStatus.ACTIVO}>Activo</option>
          <option value={PromoStatus.INACTIVO}>Inactivo</option>
          <option value={PromoStatus.EXPIRADO}>Expirado</option>
        </select>

        {/* Type filter */}
        <select
          id="promo-filter-type"
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as PromoType | "TODOS")
          }
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
        >
          <option value="TODOS">Todos los tipos</option>
          <option value={PromoType.DESCUENTO}>Descuento</option>
          <option value={PromoType.REGALO}>Regalo</option>
        </select>

        {/* Active filters chips */}
        {(search || filterStatus !== "TODOS" || filterType !== "TODOS") && (
          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={() => {
              setSearch("");
              setFilterStatus("TODOS");
              setFilterType("TODOS");
            }}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {filtered.length === promos.length
            ? `${promos.length} promos en total`
            : `${filtered.length} de ${promos.length} promos`}
        </p>
        {promos.length > 0 && (
          <div className="flex gap-2">
            <Chip size="sm" variant="flat" color="success">
              {kpis.active} activas
            </Chip>
            <Chip size="sm" variant="flat" color="danger">
              {promos.length - kpis.active} inactivas/expiradas
            </Chip>
          </div>
        )}
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            <LuTag size={30} className="text-zinc-400 dark:text-zinc-600" />
          </div>
          <div>
            <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
              No se encontraron promos
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
              {search || filterStatus !== "TODOS" || filterType !== "TODOS"
                ? "Intenta ajustar los filtros de búsqueda."
                : 'Crea tu primera promo haciendo clic en "Nueva promo".'}
            </p>
          </div>
          {!search && filterStatus === "TODOS" && filterType === "TODOS" && (
            <Button color="primary" onPress={openCreate} startContent={<LuPlus />}>
              Crear primera promo
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-6">
          {filtered.map((promo) => (
            <PromoCard
              key={promo.promoId}
              promo={promo}
              onEdit={openEdit}
              onDelete={setDeletingPromo}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <PromoFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        promo={editingPromo}
      />

      <DeletePromoModal
        promo={deletingPromo}
        onClose={() => setDeletingPromo(null)}
      />
    </Container>
  );
}
