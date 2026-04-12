import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import Load from "@/components/ui/load/Load";
import { useNavigate } from "react-router";
import { LuPlus, LuMapPin, LuEye, LuTrash, LuPencil } from "react-icons/lu";
import { useDestinations, useOperationsDestinations } from "@/modules/destinations/hooks/useDestinations";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type {
  ResponseDestination,
  Experience,
} from "@/interface/response.interface";
import {
  Button,
  Image,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { ENV } from "@/config/env";
import { useState } from "react";
import { Types } from "@/schemas/destinations/experience.schema";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";

export default function Destinations() {
  const navigate = useNavigate();
  const { destinations, isLoading, pagination } = useDestinations();
  const { deleteDestination, isDeleting } = useOperationsDestinations();

  // Modal state for experiences
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedExperiences, setSelectedExperiences] = useState<Experience[]>(
    [],
  );
  const [selectedDestName, setSelectedDestName] = useState("");

  // Modal state for deletion
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();
  const [destToDelete, setDestToDelete] = useState<ResponseDestination | null>(
    null,
  );

  const handleOpenExperiences = (
    destName: string,
    experiences: Experience[],
  ) => {
    setSelectedDestName(destName);
    setSelectedExperiences(experiences);
    onOpen();
  };

  const handleOpenConfirm = (dest: ResponseDestination) => {
    setDestToDelete(dest);
    onConfirmOpen();
  };

  const handleDelete = async () => {
    if (destToDelete) {
      await deleteDestination(destToDelete.destinationId);
      onConfirmOpenChange();
    }
  };

  const columns: ColumnDef<ResponseDestination>[] = [
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
      header: "Descripción Corta",
      accessorKey: "shortDescription",
      cell: ({ getValue }) => (
        <span className="line-clamp-2 max-w-[200px] text-xs">
          {getValue() as string}
        </span>
      ),
    },
    {
      header: "Descripción Larga",
      accessorKey: "longDescription",
      cell: ({ getValue }) => (
        <span className="line-clamp-2 max-w-[300px] text-xs">
          {getValue() as string}
        </span>
      ),
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
      header: "Experiencias",
      cell: ({ row }) => (
        <Button
          variant="flat"
          color="secondary"
          size="sm"
          startContent={<LuEye />}
          onPress={() =>
            handleOpenExperiences(row.original.name, row.original.experiences)
          }
        >
          Ver ({row.original.experiences.length})
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
            onPress={() =>
              navigate(`/destinations/update/${row.original.destinationId}`)
            }
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

  const experienceColumns: ColumnDef<Experience>[] = [
    {
      header: "Imagen",
      cell: ({ row }) => (
        <Image
          src={ENV.API_URL + row.original.galery.imageUrl}
          alt={row.original.name}
          classNames={{
            wrapper: "w-12 h-12 rounded-lg",
            img: "object-cover h-12 w-12",
          }}
        />
      ),
    },
    {
      header: "Tipo",
      accessorKey: "type",
      cell: ({ getValue }) => (
        <span className="capitalize">
          {Types.find((t) => t.value === getValue())?.label ||
            (getValue() as string)}
        </span>
      ),
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Ubicación",
      cell: ({ row }) => (
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={() => {
            const url = `https://www.google.com/maps?q=${row.original.lat},${row.original.lng}`;
            window.open(url, "_blank");
          }}
        >
          <LuMapPin size={18} />
        </Button>
      ),
    },
  ];

  return (
    <Container className="space-y-6">
      <Load loading={isLoading} />
      <Header
        text={{
          header: "Destinos",
          button: "Crear Destino",
        }}
        icon={<LuPlus size={16} />}
        onClick={() => navigate("/destinations/create")}
      />

      <Table
        data={destinations}
        columns={columns}
        isLoading={isLoading}
        emptyContent="No se encontraron destinos"
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

      {/* Modal for experiences */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                Experiencias de: {selectedDestName}
              </ModalHeader>
              <ModalBody className="py-6">
                <Table
                  data={selectedExperiences}
                  columns={experienceColumns}
                  emptyContent="Este destino no tiene experiencias registradas"
                />
              </ModalBody>
              <ModalFooter className="border-t">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={onConfirmOpenChange}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Eliminar Destino"
        description={
          <div className="flex flex-col gap-2">
            <p>¿Estás seguro que deseas eliminar este destino?</p>
            {destToDelete && (
              <div className="p-3 bg-default-100 rounded-lg border border-default-200">
                <p className="font-semibold text-foreground">{destToDelete.name}</p>
                <p className="text-xs text-default-500 line-clamp-1">{destToDelete.shortDescription}</p>
              </div>
            )}
            <p className="text-xs text-danger font-medium mt-1">Esta acción desactivará el registro.</p>
          </div>
        }
      />
    </Container>
  );
}
