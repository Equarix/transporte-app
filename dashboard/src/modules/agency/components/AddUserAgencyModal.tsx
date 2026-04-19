import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState } from "react";
import { LuSearch, LuUserPlus } from "react-icons/lu";
import { useSearchUsers } from "@/modules/user/hooks/useUser";
import { useUserAgency } from "@/modules/agency/hooks/useAgency";
import type { ResponseAgency } from "@/interface/response.interface";
import Load from "@/components/ui/load/Load";

interface AddUserAgencyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  agency: ResponseAgency | null;
}

export default function AddUserAgencyModal({
  isOpen,
  onOpenChange,
  agency,
}: AddUserAgencyModalProps) {
  const [documentNumber, setDocumentNumber] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: searchData } = useSearchUsers(documentNumber);

  const { addUserMutation } = useUserAgency(agency?.agencyId.toString() || "");

  const users = searchData?.body || [];

  const handleAddUser = async () => {
    if (!agency || !selectedUserId) return;

    await addUserMutation.mutateAsync({
      userId: Number(selectedUserId),
      agencyId: agency.agencyId,
    });

    // Clear state and close
    setDocumentNumber("");
    setSelectedUserId("");
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-3 items-center border-b border-default-100">
              <div className="p-2 bg-primary-50 rounded-lg text-primary">
                <LuUserPlus size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-md">Agregar Usuario a Agencia</span>
                <span className="text-tiny text-default-400 font-normal">
                  {agency?.name}
                </span>
              </div>
            </ModalHeader>
            <ModalBody className="py-6">
              <Load loading={addUserMutation.isPending} />

              <div className="space-y-6">
                <Input
                  label="Buscar por N° de Documento"
                  placeholder="Ingrese al menos 3 dígitos..."
                  labelPlacement="outside"
                  variant="bordered"
                  value={documentNumber}
                  onValueChange={setDocumentNumber}
                  startContent={<LuSearch className="text-default-400" />}
                />

                <Select
                  label="Usuarios Encontrados"
                  placeholder="Seleccione un usuario de la lista"
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={users.length === 0}
                  selectedKeys={selectedUserId ? [selectedUserId] : []}
                  onSelectionChange={(keys) =>
                    setSelectedUserId(Array.from(keys)[0] as string)
                  }
                  description={
                    users.length === 0 && documentNumber.length > 2
                      ? "No se encontraron usuarios"
                      : ""
                  }
                >
                  {users.map((user) => (
                    <SelectItem
                      key={user.userId.toString()}
                      textValue={`${user.profile.firstName} ${user.profile.lastName}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-small font-medium">
                          {user.profile.firstName} {user.profile.lastName}
                        </span>
                        <span className="text-tiny text-default-400">
                          {user.documentNumber} ({user.role})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-default-100 py-4">
              <Button variant="flat" color="danger" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleAddUser}
                isDisabled={!selectedUserId || addUserMutation.isPending}
                startContent={<LuUserPlus size={18} />}
              >
                Agregar Usuario
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
