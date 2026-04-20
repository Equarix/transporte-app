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
import { LuSearch, LuUserPlus, LuTrash2, LuUsers } from "react-icons/lu";
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
  const {
    query: userAgencyQuery,
    addUserMutation,
    removeUserMutation,
  } = useUserAgency(agency?.agencyId.toString() || "");

  const users = searchData?.body || [];
  const assignedUsers = userAgencyQuery.data?.body || [];

  const isUserAssigned = (userId: number) => {
    return assignedUsers.some((u) => u.user.userId === userId);
  };

  const handleAddUser = async () => {
    if (!agency || !selectedUserId) return;

    await addUserMutation.mutateAsync({
      userId: Number(selectedUserId),
      agencyId: agency.agencyId,
    });

    // Clear state
    setDocumentNumber("");
    setSelectedUserId("");
  };

  const handleRemoveUser = async (userId: number) => {
    if (!agency) return;

    await removeUserMutation.mutateAsync({
      userId,
      agencyId: agency.agencyId,
    });
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
              <Load
                loading={
                  addUserMutation.isPending || removeUserMutation.isPending
                }
              />

              <div className="space-y-6">
                <div className="bg-default-50 p-4 rounded-xl border border-default-200">
                  <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                    <LuUsers size={18} />
                    <span>Usuarios Asignados ({assignedUsers.length})</span>
                  </div>

                  {userAgencyQuery.isLoading ? (
                    <div className="flex justify-center py-4">
                      <Load loading={true} />
                    </div>
                  ) : assignedUsers.length === 0 ? (
                    <p className="text-tiny text-default-400 text-center py-2">
                      No hay usuarios asignados a esta agencia yet.
                    </p>
                  ) : (
                    <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                      {assignedUsers.map((item) => (
                        <div
                          key={item.userAgencyId}
                          className="flex items-center justify-between p-2 bg-white rounded-lg border border-default-100 shadow-sm"
                        >
                          <div className="flex flex-col">
                            <span className="text-small font-medium">
                              {item.user.profile.firstName}{" "}
                              {item.user.profile.lastName}
                            </span>
                            <span className="text-tiny text-default-400">
                              {item.user.documentNumber}
                            </span>
                          </div>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleRemoveUser(item.user.userId)}
                          >
                            <LuTrash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-default-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-default-400">
                      Vincular Nuevo Usuario
                    </span>
                  </div>
                </div>
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
                  disabledKeys={assignedUsers.map((u) => u.user.userId.toString())}
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
                      description={
                        isUserAssigned(user.userId) ? "Ya asignado" : ""
                      }
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
