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
import { useState } from "react";
import { instance } from "@/libs/axios";

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
  const [destination, setDestination] = useState("Trujillo");
  const [loading, setLoading] = useState(false);
  const [alertStatus, setAlertStatus] = useState<string | null>(null);

  if (!user) return null;

  const profile = user.profile;

  const handleSendPromo = async () => {
    if (!profile?.phone) return;
    setLoading(true);
    setAlertStatus(null);
    try {
      const response = await instance.post<any>("/public/ia/alerts/whatsapp", {
        phone: profile.phone,
        destinationName: destination,
      });
      const body = response.data?.body;
      if (body?.success) {
        setAlertStatus(
          `¡Alerta enviada con éxito! Mensaje: "${body.message}"`
        );
      } else {
        setAlertStatus("Ocurrió un error al enviar la alerta.");
      }
    } catch (error) {
      console.error(error);
      setAlertStatus("Error de conexión al enviar la alerta.");
    } finally {
      setLoading(false);
    }
  };

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

              <Divider className="my-2" />

              {/* Alertas de Promociones WhatsApp */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-foreground">
                  Campañas de Promoción Personalizadas (RF-04)
                </h4>
                <p className="text-xs text-default-500">
                  Envía una alerta de WhatsApp al número de este usuario ({profile.phone || "Sin teléfono registrado"}) mediante el servicio de IA en Python.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider block">
                      Destino Recomendado
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3 py-2 bg-default-50 dark:bg-zinc-800 border border-default-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none"
                    >
                      <option value="Trujillo">Trujillo</option>
                      <option value="Lima">Lima</option>
                      <option value="Chiclayo">Chiclayo</option>
                      <option value="Cajamarca">Cajamarca</option>
                      <option value="Chimbote">Chimbote</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendPromo}
                    disabled={!profile.phone || loading}
                    className="px-4 py-2 bg-[#e87722] hover:bg-[#d66513] disabled:bg-default-150 disabled:text-default-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {loading ? "Enviando..." : "Enviar Alerta WhatsApp"}
                  </button>
                </div>
                {alertStatus && (
                  <div className="p-3 bg-success-50 dark:bg-emerald-950/20 border border-success-200 dark:border-emerald-800/30 rounded-xl mt-2">
                    <p className="text-xs text-success-700 dark:text-emerald-400 font-bold">
                      {alertStatus}
                    </p>
                  </div>
                )}
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
