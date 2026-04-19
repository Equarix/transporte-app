import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
  Divider,
} from "@heroui/react";
import type { AuthResponse } from "@/interface/response.interface";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuCalendar,
  LuFileText,
  LuShieldCheck,
  LuBriefcase,
} from "react-icons/lu";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserProfileModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: AuthResponse | null;
}

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

export default function UserProfileModal({
  isOpen,
  onOpenChange,
  user,
}: UserProfileModalProps) {
  if (!user) return null;

  const profile = user.profile;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
        header: "border-b border-zinc-100 dark:border-zinc-800",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
                  <LuUser size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Perfil de Usuario
                  </h2>
                  <p className="text-tiny text-default-400 font-normal">
                    ID: #{user.userId}
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="pb-8 gap-6 pt-6">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1 space-y-1">
                  <h3 className="text-2xl font-bold text-foreground">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Chip
                      variant="flat"
                      color={user.role === "admin" ? "warning" : "primary"}
                      size="sm"
                      startContent={<LuShieldCheck size={14} className="ml-1" />}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </Chip>
                    <Chip
                      variant="dot"
                      color="secondary"
                      size="sm"
                    >
                      {TYPE_USER_LABELS[profile.typeUser] || profile.typeUser}
                    </Chip>
                    <Chip
                      color={profile.isActive ? "success" : "danger"}
                      variant="flat"
                      size="sm"
                    >
                      {profile.isActive ? "Activo" : "Inactivo"}
                    </Chip>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={<LuMail className="text-primary" />}
                  label="Correo Electrónico"
                  value={profile.email}
                />
                <InfoItem
                  icon={<LuPhone className="text-primary" />}
                  label="Teléfono"
                  value={profile.phone || "No registrado"}
                />
                <InfoItem
                  icon={<LuFileText className="text-primary" />}
                  label="Documento"
                  value={`${TYPE_DOCUMENT_LABELS[user.typeDocument] || user.typeDocument}: ${user.documentNumber}`}
                />
                <InfoItem
                  icon={<LuCalendar className="text-primary" />}
                  label="Fecha de Nacimiento"
                  value={
                    profile.dateOfBirth
                      ? format(new Date(profile.dateOfBirth), "PPP", {
                          locale: es,
                        })
                      : "No registrada"
                  }
                />
                <InfoItem
                  icon={<LuBriefcase className="text-primary" />}
                  label="Tipo de Usuario"
                  value={TYPE_USER_LABELS[profile.typeUser] || profile.typeUser}
                />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1">{icon}</div>
      <div className="flex flex-col">
        <span className="text-tiny text-default-400 uppercase font-semibold tracking-wider">
          {label}
        </span>
        <span className="text-small font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}
