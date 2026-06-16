import { Chip } from "@heroui/react";
import { PromoStatus } from "../types/promo.types";

interface PromoStatusBadgeProps {
  status: PromoStatus;
}

const STATUS_CONFIG: Record<
  PromoStatus,
  { label: string; color: "success" | "default" | "danger" }
> = {
  [PromoStatus.ACTIVO]: { label: "Activo", color: "success" },
  [PromoStatus.INACTIVO]: { label: "Inactivo", color: "default" },
  [PromoStatus.EXPIRADO]: { label: "Expirado", color: "danger" },
};

export function PromoStatusBadge({ status }: PromoStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[PromoStatus.INACTIVO];
  return (
    <Chip size="sm" variant="flat" color={config.color}>
      {config.label}
    </Chip>
  );
}
