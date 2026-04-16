import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { StatusReserverEnum } from "../enum/status-reserver.enum";

interface StatusChangeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentStatus?: string;
  reserverId?: number;
  onConfirm: (id: number, status: StatusReserverEnum) => void;
}

const STATUS_OPTIONS = [
  { key: StatusReserverEnum.PENDING, label: "Pendiente", color: "warning" },
  { key: StatusReserverEnum.CONFIRMED, label: "Confirmado", color: "primary" },
  { key: StatusReserverEnum.COMPLETED, label: "Completado", color: "success" },
  { key: StatusReserverEnum.CANCELLED, label: "Cancelado", color: "danger" },
  { key: StatusReserverEnum.REJECTED, label: "Rechazado", color: "danger" },
];

export default function StatusChangeModal({
  isOpen,
  onOpenChange,
  currentStatus,
  reserverId,
  onConfirm,
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<StatusReserverEnum>(
    (currentStatus as StatusReserverEnum) || StatusReserverEnum.PENDING
  );

  useEffect(() => {
    if (currentStatus) {
      setSelectedStatus(currentStatus as StatusReserverEnum);
    }
  }, [currentStatus]);

  const handleConfirm = () => {
    if (reserverId) {
      onConfirm(reserverId, selectedStatus);
      onOpenChange(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      className="max-w-md"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Cambiar Estado de Reserva
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-default-500 mb-4">
                Seleccione el nuevo estado para la reserva #
                <span className="font-bold text-foreground">{reserverId}</span>.
              </p>
              <Select
                label="Estado"
                placeholder="Seleccione un estado"
                selectedKeys={[selectedStatus]}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as StatusReserverEnum)
                }
                variant="bordered"
              >
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.key} className="capitalize">
                    {status.label}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleConfirm}>
                Guardar Cambios
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
