import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import * as Icons from "react-icons/lu";
import { LuListChecks } from "react-icons/lu";

interface InputIconProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
}

export default function InputIcon({
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
}: InputIconProps) {
  const [showModal, setShowModal] = useState(false);
  const [findIcon, setFindIcon] = useState("");

  const IconComp = value ? (Icons[value as keyof typeof Icons] as any) : null;

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer pointer-events-auto"
      >
        <Input
          label={label}
          placeholder={placeholder}
          value={value}
          isReadOnly
          errorMessage={errorMessage}
          labelPlacement="inside"
          endContent={
            IconComp ? (
              <IconComp size={20} className="text-default-500" />
            ) : (
              <LuListChecks size={20} className="text-default-400" />
            )
          }
          classNames={{
            input: "cursor-pointer",
            inputWrapper: "!cursor-pointer",
          }}
        />
        {/* Overlay to capture clicks if Input doesn't propagate them well in readOnly mode, though usually it does */}
        <div className="absolute inset-0 z-10 cursor-pointer" />
      </div>

      <Modal
        isOpen={showModal}
        onOpenChange={setShowModal}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent className="max-h-[80vh]">
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <LuListChecks />
                Seleccione un icono
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Buscar Icono (e.g. User, Home, Arrow)"
                  value={findIcon}
                  onValueChange={setFindIcon}
                  startContent={
                    <Icons.LuSearch size={18} className="text-default-400" />
                  }
                  className="sticky top-0 z-20 bg-background pb-2"
                />

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 overflow-y-auto p-2">
                  {Object.keys(Icons)
                    .filter((item) =>
                      item.toLowerCase().includes(findIcon.toLowerCase()),
                    )
                    .map((iconName) => {
                      const IconRender = Icons[
                        iconName as keyof typeof Icons
                      ] as any;
                      if (!IconRender) return null;

                      return (
                        <div
                          key={iconName}
                          className={`
                            flex flex-col items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer transition-colors
                            ${
                              value === iconName
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-default-200 hover:bg-default-100 dark:hover:bg-default-50"
                            }
                          `}
                          onClick={() => {
                            onChange?.(iconName);
                            onClose();
                          }}
                        >
                          <IconRender size={24} />
                          <span className="text-[10px] text-center w-full truncate px-1">
                            {iconName}
                          </span>
                        </div>
                      );
                    })}
                  {Object.keys(Icons).filter((item) =>
                    item.toLowerCase().includes(findIcon.toLowerCase()),
                  ).length === 0 && (
                    <div className="col-span-full text-center text-default-400 py-8">
                      No se encontraron iconos.
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
