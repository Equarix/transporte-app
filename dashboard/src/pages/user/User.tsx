import { useNavigate } from "react-router";
import { LuPlus, LuPencil, LuTrash, LuUser } from "react-icons/lu";
import Container from "@/components/ui/container/Container";
import Header from "@/components/layouts/header/Header";
import { useUser } from "@/modules/user/hooks/useUser";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { AuthResponse } from "@/interface/response.interface";
import { Button, Pagination, Chip, useDisclosure } from "@heroui/react";
import { useState } from "react";
import UserProfileModal from "@/modules/user/components/UserProfileModal";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  seller: "Vendedor",
  user: "Usuario",
};

const TYPE_USER_LABELS: Record<string, string> = {
  EMPLOYEE: "Empleado",
  DRIVER: "Conductor",
};

const TYPE_DOCUMENT_LABELS: Record<string, string> = {
  DNI: "DNI",
  PASSPORT: "Pasaporte",
};

export default function User() {
  const navigate = useNavigate();
  const { users, pagination, isLoading } = useUser();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<AuthResponse | null>(null);

  const handleViewProfile = (user: AuthResponse) => {
    setSelectedUser(user);
    onOpen();
  };

  const columns: ColumnDef<AuthResponse>[] = [
    {
      header: "Usuario",
      accessorKey: "profile",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">
            {row.original.profile.firstName} {row.original.profile.lastName}
          </span>
          <span className="text-tiny text-default-400">
            {row.original.profile.email}
          </span>
        </div>
      ),
    },
    {
      header: "Documento",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-small font-medium">
            {TYPE_DOCUMENT_LABELS[row.original.typeDocument] ||
              row.original.typeDocument}
          </span>
          <span className="text-tiny text-default-400">
            {row.original.documentNumber}
          </span>
        </div>
      ),
    },
    {
      header: "Rol",
      accessorKey: "role",
      cell: ({ getValue }) => {
        const role = getValue() as string;
        return (
          <Chip
            variant="flat"
            size="sm"
            color={role === "admin" ? "warning" : "primary"}
            className="capitalize"
          >
            {ROLE_LABELS[role] || role}
          </Chip>
        );
      },
    },
    {
      header: "Tipo",
      cell: ({ row }) => (
        <Chip variant="dot" size="sm" color="secondary">
          {TYPE_USER_LABELS[row.original.profile.typeUser] ||
            row.original.profile.typeUser}
        </Chip>
      ),
    },
    {
      header: "Estado",
      cell: ({ row }) => {
        const isActive = row.original.profile.isActive;
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
            color="success"
            size="sm"
            onPress={() => handleViewProfile(row.original)}
            title="Ver Perfil"
          >
            <LuUser size={18} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            size="sm"
            onPress={() => navigate(`/user/update/${row.original.userId}`)}
            title="Editar Usuario"
          >
            <LuPencil size={18} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="danger"
            size="sm"
            onPress={() => console.log("Delete User", row.original.userId)}
            title="Eliminar Usuario"
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
          header: "Usuarios",
          button: "Crear Usuario",
        }}
        icon={<LuPlus />}
        onClick={() => navigate("/user/create")}
      />

      <Table
        data={users}
        columns={columns}
        isLoading={isLoading}
        emptyContent="No se encontraron usuarios"
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

      <UserProfileModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        user={selectedUser}
      />
    </Container>
  );
}
