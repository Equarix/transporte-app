import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { LuTriangleAlert, LuTrash2 } from "react-icons/lu";
import { useDeletePromo } from "../hooks/useDeletePromo";
import type { Promo } from "../types/promo.types";

interface DeletePromoModalProps {
  promo: Promo | null;
  onClose: () => void;
}

export function DeletePromoModal({ promo, onClose }: DeletePromoModalProps) {
  const { deletePromo, isDeleting } = useDeletePromo({ onSuccess: onClose });

  return (
    <Modal
      isOpen={!!promo}
      onOpenChange={(open) => { if (!open) onClose(); }}
      size="sm"
      backdrop="blur"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-default-100">
              <div className="flex items-center gap-2 text-danger">
                <LuTriangleAlert size={18} />
                <span>Eliminar promo</span>
              </div>
            </ModalHeader>

            <ModalBody className="py-6 text-center">
              <p className="text-sm text-default-600">
                ¿Estás seguro de que deseas eliminar la promo{" "}
                <span className="font-semibold text-foreground">
                  {promo?.name}
                </span>{" "}
                (
                <span className="font-mono text-default-500">
                  {promo?.code}
                </span>
                )?
              </p>
              <p className="mt-2 text-xs text-danger/80">
                Esta acción no se puede deshacer.
              </p>
            </ModalBody>

            <ModalFooter className="border-t border-default-100">
              <Button
                id="delete-modal-cancel"
                variant="light"
                onPress={onClose}
              >
                Cancelar
              </Button>
              <Button
                id="delete-modal-confirm"
                color="danger"
                isLoading={isDeleting}
                isDisabled={isDeleting || !promo}
                startContent={!isDeleting ? <LuTrash2 size={15} /> : undefined}
                onPress={() => promo && deletePromo(promo.promoId)}
              >
                {isDeleting ? "Eliminando…" : "Confirmar"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
