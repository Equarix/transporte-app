import Container from "@/components/ui/container/Container";
import Header from "@/components/layouts/header/Header";
import Load from "@/components/ui/load/Load";
import { useAgency, useOperationsAgency } from "@/modules/agency/hooks/useAgency";
import { useNavigate } from "react-router";
import Table from "@/components/ui/table/Table";
import { Pagination, Button, Image, Chip, useDisclosure } from "@heroui/react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ResponseAgency } from "@/interface/response.interface";
import { LuPlus, LuMapPin, LuPencil, LuTrash } from "react-icons/lu";
import { ENV } from "@/config/env";
import { useState } from "react";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";

export default function Agency() {
  const { agencies, pagination, isLoading } = useAgency();
  const { deleteAgency, isDeleting } = useOperationsAgency();
  const navigate = useNavigate();

  // Modal state for deletion
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();
  const [agencyToDelete, setAgencyToDelete] = useState<ResponseAgency | null>(
    null,
  );

  const handleOpenConfirm = (agency: ResponseAgency) => {
    setAgencyToDelete(agency);
    onConfirmOpen();
  };

  const handleDelete = async () => {
    if (agencyToDelete) {
      await deleteAgency(agencyToDelete.agencyId);
      onConfirmOpenChange();
    }
  };

  const columns: ColumnDef<ResponseAgency>[] = [
    {
      header: "Imagen",
      accessorKey: "galery.imageUrl",
      cell: ({ row }) => (
        <Image
          src={ENV.API_URL + row.original.galery.imageUrl}
          alt={row.original.name}
          classNames={{
            wrapper: "w-16 h-16 rounded-lg",
            img: "object-cover h-16 w-16",
          }}
        />
      ),
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Dirección",
      accessorKey: "address",
    },
    {
      header: "Teléfono",
      accessorKey: "phone",
    },
    {
      header: "Ubicación",
      cell: ({ row }) => (
        <Button
          isIconOnly
          variant="light"
          color="primary"
          onPress={() => {
            const url = `https://www.google.com/maps?q=${row.original.lat},${row.original.lng}`;
            window.open(url, "_blank");
          }}
          title="Ver en Google Maps"
        >
          <LuMapPin size={20} />
        </Button>
      ),
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const isVisible = getValue() as boolean;
        return (
          <Chip
            color={isVisible ? "success" : "danger"}
            variant="flat"
            size="sm"
          >
            {isVisible ? "Activo" : "Inactivo"}
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
            onPress={() => navigate(`/agency/update/${row.original.agencyId}`)}
          >
            <LuPencil size={18} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="danger"
            size="sm"
            onPress={() => handleOpenConfirm(row.original)}
          >
            <LuTrash size={18} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container className="space-y-6">
      <Load loading={isLoading} />
      <Header
        text={{
          header: "Agencias",
          button: "Crear Agencia",
        }}
        icon={<LuPlus size={16} />}
        onClick={() => navigate("/agency/create")}
      />

      <Table
        data={agencies}
        columns={columns}
        isLoading={isLoading}
        emptyContent="No se encontraron agencias"
        bottomContent={
          pagination.totalPages! > 1 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={pagination.currentPage}
                total={pagination.totalPages!}
                onChange={(page) => pagination.setCurrentPage(page)}
              />
            </div>
          )
        }
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={onConfirmOpenChange}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Eliminar Agencia"
        description={
          <div className="flex flex-col gap-2">
            <p>¿Estás seguro que deseas eliminar esta agencia?</p>
            {agencyToDelete && (
              <div className="p-3 bg-default-100 rounded-lg border border-default-200">
                <p className="font-semibold text-foreground">{agencyToDelete.name}</p>
                <p className="text-xs text-default-500 line-clamp-1">{agencyToDelete.address}</p>
              </div>
            )}
            <p className="text-xs text-danger font-medium mt-1">Esta acción desactivará el registro.</p>
          </div>
        }
      />
    </Container>
  );
}
