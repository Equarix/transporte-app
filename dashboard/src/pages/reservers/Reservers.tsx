import { useReservers } from "@/modules/reservers/hooks/useReservers";
import { useNavigate } from "react-router";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ResponseReserver } from "@/interface/response.interface";
import {
  Chip,
  Button,
  useDisclosure,
  Tooltip,
  Pagination,
} from "@heroui/react";
import { LuCalendar, LuMapPin, LuPlus, LuUser, LuEye } from "react-icons/lu";
import { useState } from "react";
import StatusChangeModal from "@/modules/reservers/components/StatusChangeModal";
import DetailReserverModal from "@/modules/reservers/components/DetailReserverModal";
import { StatusReserverEnum } from "@/modules/reservers/enum/status-reserver.enum";
import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import { format } from "date-fns";
import { IoMdMore } from "react-icons/io";
const STATUS_COLOR_MAP: Record<
  string,
  "warning" | "primary" | "success" | "danger" | "default"
> = {
  [StatusReserverEnum.PENDING]: "warning",
  [StatusReserverEnum.CONFIRMED]: "primary",
  [StatusReserverEnum.COMPLETED]: "success",
  [StatusReserverEnum.CANCELLED]: "danger",
  [StatusReserverEnum.REJECTED]: "danger",
};

const STATUS_LABEL_MAP: Record<string, string> = {
  [StatusReserverEnum.PENDING]: "Pendiente",
  [StatusReserverEnum.CONFIRMED]: "Confirmado",
  [StatusReserverEnum.COMPLETED]: "Completado",
  [StatusReserverEnum.CANCELLED]: "Cancelado",
  [StatusReserverEnum.REJECTED]: "Rechazado",
};

export default function Reservers() {
  const navigate = useNavigate();
  const { data, isLoading, pagination, isPending, mutate } = useReservers();
  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onOpenChange: onStatusOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onOpenChange: onDetailOpenChange,
  } = useDisclosure();

  const [selectedReserver, setSelectedReserver] =
    useState<ResponseReserver | null>(null);

  const handleOpenStatusModal = (reserver: ResponseReserver) => {
    setSelectedReserver(reserver);
    onStatusOpen();
  };

  const handleOpenDetailModal = (reserver: ResponseReserver) => {
    setSelectedReserver(reserver);
    onDetailOpen();
  };

  const columns: ColumnDef<ResponseReserver>[] = [
    {
      accessorKey: "reserverId",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">#{row.original.reserverId}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha de Viaje",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <LuCalendar className="text-default-400" />
          <span>{format(row.original.date, "dd/MM/yyyy")}</span>
        </div>
      ),
    },
    {
      header: "Ruta",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs">
            <LuMapPin className="text-success size-3" />
            <span className="font-semibold">{row.original.checkIn.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <LuMapPin className="text-danger size-3" />
            <span className="font-semibold">{row.original.checkOut.name}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Conductor / Bus",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-tiny">
            <LuUser className="text-default-400" />
            <span>
              {row.original.driver.firstName} {row.original.driver.lastName}
            </span>
          </div>
          <div className="flex items-center gap-1 text-tiny font-mono">
            <span className="bg-default-100 px-1 rounded text-default-600">
              {row.original.bus.plate}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          color={STATUS_COLOR_MAP[row.original.status as StatusReserverEnum]}
          size="sm"
          variant="flat"
        >
          {STATUS_LABEL_MAP[row.original.status] || row.original.status}
        </Chip>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Ver Detalle">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => handleOpenDetailModal(row.original)}
              color="primary"
            >
              <LuEye className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Cambiar Estado">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => handleOpenStatusModal(row.original)}
            >
              <IoMdMore className="text-default-400 size-5" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Container className="mx-auto space-y-4">
      <Header
        text={{
          header: "Reservas",
          button: "Crear Reserva",
        }}
        icon={<LuPlus className="size-5" />}
        onClick={() => navigate("create")}
      />

      <Table
        data={data?.body ?? []}
        columns={columns}
        isLoading={isLoading || isPending}
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              color="primary"
              page={pagination.currentPage}
              total={pagination.totalPages || 0}
              onChange={(page) => pagination.setCurrentPage(page)}
            />
          </div>
        }
        emptyContent="No se encontraron reservas."
      />

      <StatusChangeModal
        isOpen={isStatusOpen}
        onOpenChange={onStatusOpenChange}
        reserverId={selectedReserver?.reserverId}
        currentStatus={selectedReserver?.status}
        onConfirm={(id, status) =>
          mutate({
            id,
            status,
          })
        }
      />

      <DetailReserverModal
        isOpen={isDetailOpen}
        onOpenChange={onDetailOpenChange}
        reserver={selectedReserver}
      />
    </Container>
  );
}
