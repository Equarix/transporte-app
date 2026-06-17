import { useNavigate } from "react-router";
import {
  LuPlus,
  LuPencil,
  LuTrash,
  LuUser,
  LuBell,
  LuSend,
  LuHistory,
} from "react-icons/lu";
import Container from "@/components/ui/container/Container";
import Header from "@/components/layouts/header/Header";
import { useUser } from "@/modules/user/hooks/useUser";
import Table from "@/components/ui/table/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { AuthResponse } from "@/interface/response.interface";
import {
  Button,
  Pagination,
  Chip,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { useState, useEffect } from "react";
import UserProfileModal from "@/modules/user/components/UserProfileModal";
import { instance } from "@/libs/axios";
import { useAuth } from "@/components/providers/AuthContext";

interface NotificationAlert {
  alertId: number;
  userId: number;
  title: string;
  message: string;
  code: string | null;
  discount: string | null;
  sentAt: string;
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

export default function User() {
  const navigate = useNavigate();
  const { users, pagination, isLoading } = useUser();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<AuthResponse | null>(null);

  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);
  const [massiveTitle, setMassiveTitle] = useState("");
  const [massiveMessage, setMassiveMessage] = useState("");
  const [massiveCode, setMassiveCode] = useState("");
  const [massiveDiscount, setMassiveDiscount] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const { token } = useAuth();

  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const response = await instance.get<ApiResponse<NotificationAlert[]>>(
        "/notifications/all-alerts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlerts(response.data.body || []);
    } catch (error) {
      console.error("Error fetching alerts", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [token]);

  const handleSendMassive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!massiveTitle || !massiveMessage) return;
    setSending(true);
    setStatusMsg(null);
    try {
      await instance.post(
        "/notifications/massive",
        {
          title: massiveTitle,
          message: massiveMessage,
          code: massiveCode || undefined,
          discount: massiveDiscount || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setStatusMsg("¡Alerta masiva enviada a todos los usuarios con éxito!");
      setMassiveTitle("");
      setMassiveMessage("");
      setMassiveCode("");
      setMassiveDiscount("");
      fetchAlerts();
    } catch (error) {
      console.error("Error sending massive alert", error);
      setStatusMsg("Error al enviar la alerta masiva.");
    } finally {
      setSending(false);
    }
  };

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

      <Divider className="my-6" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enviar Alerta Masiva */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-warning-600 font-extrabold text-sm border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <LuBell size={18} />
            <span>Enviar Alerta Masiva (Marketing / Notificaciones)</span>
          </div>

          <form onSubmit={handleSendMassive} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider block">
                Título del Mensaje
              </label>
              <input
                type="text"
                placeholder="Ej. ¡25% de descuento en tu siguiente viaje!"
                value={massiveTitle}
                onChange={(e) => setMassiveTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-default-50 dark:bg-zinc-800 border border-default-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider block">
                Contenido / Mensaje
              </label>
              <textarea
                placeholder="Escribe el mensaje que recibirán todos los usuarios..."
                value={massiveMessage}
                onChange={(e) => setMassiveMessage(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 bg-default-50 dark:bg-zinc-800 border border-default-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider block">
                  Código de Cupón
                </label>
                <input
                  type="text"
                  placeholder="Ej. PROMO25"
                  value={massiveCode}
                  onChange={(e) => setMassiveCode(e.target.value)}
                  className="w-full px-3 py-2 bg-default-50 dark:bg-zinc-800 border border-default-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-default-400 uppercase tracking-wider block">
                  Descuento
                </label>
                <input
                  type="text"
                  placeholder="Ej. 25% DCTO"
                  value={massiveDiscount}
                  onChange={(e) => setMassiveDiscount(e.target.value)}
                  className="w-full px-3 py-2 bg-default-50 dark:bg-zinc-800 border border-default-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              color="warning"
              disabled={sending}
              className="w-full text-xs font-bold text-white bg-[#e87722] hover:bg-[#d66513] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer py-2"
            >
              <LuSend size={14} />
              {sending ? "Enviando masivo..." : "Enviar a todos los usuarios"}
            </Button>

            {statusMsg && (
              <p className="text-[10px] font-bold text-success-600 dark:text-emerald-400 mt-2 text-center font-semibold">
                {statusMsg}
              </p>
            )}
          </form>
        </div>

        {/* Registro de Alertas Enviadas */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-extrabold text-sm border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <LuHistory size={18} />
            <span>Registro de Notificaciones Disparadas (Buzón General)</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[340px] space-y-3 pr-2 scrollbar-thin">
            {alerts.length === 0 ? (
              <p className="text-xs text-default-400 text-center py-8">
                No se han registrado envíos de alertas en el sistema aún.
              </p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.alertId}
                  className="p-3.5 bg-default-50 dark:bg-zinc-800/40 border border-default-200 dark:border-zinc-800 rounded-2xl flex flex-col gap-1"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-foreground">
                      {alert.title}
                    </span>
                    <span className="text-[9px] text-default-400 font-medium">
                      {new Date(alert.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-default-650 leading-normal">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1 border-t border-default-100/50 pt-1.5">
                    {alert.code && (
                      <span className="text-[9px] font-black bg-orange-50 dark:bg-orange-950/20 text-[#e87722] px-2 py-0.5 rounded-full border border-orange-100 dark:border-orange-900/40">
                        Código: {alert.code}
                      </span>
                    )}
                    {alert.discount && (
                      <span className="text-[9px] font-black bg-amber-50 dark:bg-amber-950/20 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/40">
                        {alert.discount}
                      </span>
                    )}
                    <span className="text-[9px] text-default-450 font-extrabold ml-auto">
                      Enviado a Usuario: #{alert.userId}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <UserProfileModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        user={selectedUser}
      />
    </Container>
  );
}
