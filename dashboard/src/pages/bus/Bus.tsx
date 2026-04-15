import { useNavigate } from "react-router";
import { LuPlus, LuEye, LuPencil, LuTrash } from "react-icons/lu";
import Container from "@/components/ui/container/Container";
import Header from "@/components/layouts/header/Header";
import { useBus } from "@/modules/bus/hooks/useBus";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ResponseBus } from "@/interface/response.interface";
import { Button, Pagination, Chip, useDisclosure } from "@heroui/react";
import { useState } from "react";
import BusSeatsModal from "./components/BusSeatsModal";

export default function Bus() {
  const navigate = useNavigate();
  const { bus, pagination, isLoading } = useBus();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedBus, setSelectedBus] = useState<ResponseBus | null>(null);

  const handleOpenSeats = (bus: ResponseBus) => {
    setSelectedBus(bus);
    onOpen();
  };

  const columns: ColumnDef<ResponseBus>[] = [
    {
      header: "Placa",
      accessorKey: "plate",
      cell: ({ getValue }) => (
        <span className="font-semibold text-primary">
          {getValue() as string}
        </span>
      ),
    },
    {
      header: "Modelo",
      accessorKey: "model",
    },
    {
      header: "Año",
      accessorKey: "year",
    },
    {
      header: "Capacidad",
      accessorKey: "capacity",
      cell: ({ getValue }) => (
        <Chip variant="flat" size="sm" color="secondary">
          {getValue() as number} asientos
        </Chip>
      ),
    },
    {
      header: "Asientos",
      cell: ({ row }) => (
        <Button
          variant="flat"
          color="primary"
          size="sm"
          startContent={<LuEye />}
          onPress={() => handleOpenSeats(row.original)}
        >
          Ver Asientos
        </Button>
      ),
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const isActive = getValue() as boolean;
        return (
          <Chip
            color={isActive ? "success" : "danger"}
            variant="flat"
            size="sm"
          >
            {isActive ? "Activo" : "Inactivo"}
          </Chip>
        );
      },
    },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            size="sm"
            onPress={() => navigate(`/bus/update/${row.original.busId}`)}
            title="Editar Bus"
          >
            <LuPencil size={18} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="danger"
            size="sm"
            onPress={() => console.log("Delete", row.original.busId)}
            title="Eliminar Bus"
          >
            <LuTrash size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container className="space-y-6">
      <Header
        text={{
          header: "Buses",
          button: "Crear Bus",
        }}
        icon={<LuPlus />}
        onClick={() => navigate("/bus/create")}
      />

      <Table
        data={bus}
        columns={columns}
        isLoading={isLoading}
        emptyContent="No se encontraron buses"
        bottomContent={
          (pagination?.totalPages || 0) > 1 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={pagination.currentPage}
                total={pagination.totalPages || 0}
                onChange={(page) => pagination.setCurrentPage(page)}
              />
            </div>
          )
        }
      />

      <BusSeatsModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        bus={selectedBus}
      />
    </Container>
  );
}
