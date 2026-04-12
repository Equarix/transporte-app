import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import type { ReactNode } from "react";
import { LuTriangleAlert } from "react-icons/lu";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: ReactNode;
  isLoading?: boolean;
  confirmColor?: "primary" | "danger" | "warning";
  confirmText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  description = "¿Estás seguro de que deseas realizar esta acción?",
  isLoading,
  confirmColor = "danger",
  confirmText = "Confirmar",
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {confirmColor === "danger" && (
                  <LuTriangleAlert className="text-danger" />
                )}
                {title}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="text-default-500">{description}</div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button
                color={confirmColor}
                onPress={() => {
                  onConfirm();
                }}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
