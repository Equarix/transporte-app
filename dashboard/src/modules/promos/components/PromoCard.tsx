import { Button } from "@heroui/react";
import {
  LuTag,
  LuGift,
  LuPercent,
  LuDollarSign,
  LuCalendar,
  LuUsers,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { PromoStatusBadge } from "./PromoStatusBadge";
import { DiscountMode, PromoType, type Promo } from "../types/promo.types";

interface PromoCardProps {
  promo: Promo;
  onEdit: (promo: Promo) => void;
  onDelete: (promo: Promo) => void;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(val);

export function PromoCard({ promo, onEdit, onDelete }: PromoCardProps) {
  const isDiscount = promo.promoType === PromoType.DESCUENTO;

  const discountLabel = isDiscount
    ? promo.discountMode === DiscountMode.PORCENTAJE
      ? `${promo.discountValue}% de descuento`
      : `${formatCurrency(promo.discountValue ?? 0)} de descuento`
    : null;

  const usagePercent =
    promo.maxGlobalUses !== null
      ? Math.min(
          100,
          Math.round((promo.totalUses / promo.maxGlobalUses) * 100),
        )
      : null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-default-200 bg-default-50 p-5 shadow-sm hover:shadow-md hover:border-default-300 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl ${
              isDiscount
                ? "bg-secondary-100 text-secondary-600"
                : "bg-warning-100 text-warning-600"
            }`}
          >
            {isDiscount ? <LuPercent size={20} /> : <LuGift size={20} />}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">
              {promo.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <LuTag size={11} className="text-default-400" />
              <span className="text-xs font-mono text-default-400 tracking-wide">
                {promo.code}
              </span>
            </div>
          </div>
        </div>
        <PromoStatusBadge status={promo.status} />
      </div>

      {/* Discount / Gift summary */}
      <div
        className={`rounded-lg px-3 py-2 text-sm font-semibold ${
          isDiscount
            ? "bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400"
            : "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
        }`}
      >
        {isDiscount ? discountLabel : promo.giftDescription}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-default-400">
        {promo.minimumPurchaseAmount > 0 && (
          <div className="flex items-center gap-1.5">
            <LuDollarSign size={12} />
            <span>
              Mínimo{" "}
              <span className="text-foreground font-medium">
                {formatCurrency(promo.minimumPurchaseAmount)}
              </span>
            </span>
          </div>
        )}
        {promo.maxUsesPerUser !== null && (
          <div className="flex items-center gap-1.5">
            <LuUsers size={12} />
            <span>
              Máx.{" "}
              <span className="text-foreground font-medium">
                {promo.maxUsesPerUser}
              </span>{" "}
              uso/usuario
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 col-span-2">
          <LuCalendar size={12} />
          <span>
            <span className="text-foreground font-medium">
              {formatDate(promo.startsAt)}
            </span>{" "}
            →{" "}
            <span className="text-foreground font-medium">
              {formatDate(promo.expiresAt)}
            </span>
          </span>
        </div>
      </div>

      {/* Usage bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-default-400">
          <span>Usos totales</span>
          <span className="text-foreground font-medium">
            {promo.totalUses}
            {promo.maxGlobalUses !== null && ` / ${promo.maxGlobalUses}`}
          </span>
        </div>
        {usagePercent !== null && (
          <div className="h-1.5 w-full rounded-full bg-default-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercent >= 90
                  ? "bg-danger"
                  : usagePercent >= 60
                    ? "bg-warning"
                    : "bg-success"
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Button
          id={`edit-promo-${promo.promoId}`}
          size="sm"
          variant="light"
          color="primary"
          startContent={<LuPencil size={13} />}
          onPress={() => onEdit(promo)}
        >
          Editar
        </Button>
        <Button
          id={`delete-promo-${promo.promoId}`}
          size="sm"
          variant="light"
          color="danger"
          startContent={<LuTrash2 size={13} />}
          onPress={() => onDelete(promo)}
        >
          Eliminar
        </Button>
      </div>
    </div>
  );
}
