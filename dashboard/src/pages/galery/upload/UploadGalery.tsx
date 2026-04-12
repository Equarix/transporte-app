import { useAuth } from "@/components/providers/AuthContext";
import { useDrop } from "@/hooks/useDrop";
import type { ModalProps } from "@/interface/utils.interface";
import { instance } from "@/libs/axios";
import { GalerySchema, type GaleryType } from "@/schemas/galery/galery.schema";
import {
  addToast,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";

export default function UploadGalery({
  isOpen,
  onClose,
  onConfirm,
}: ModalProps) {
  const {
    formState: { errors },
    setValue,
    control,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(GalerySchema),
  });

  const { divProps, inputProps, isOver, onClickInput } = useDrop({
    onDrop: (files: File[]) => {
      const [image] = files;
      if (!image) return;
      setValue("file", image);
    },
    accept: "image/*",
  });

  const fileWatch = useWatch({
    control,
    name: "file",
  });
  const { token } = useAuth();

  const { mutate } = useMutation({
    mutationFn: async (data: GaleryType) => {
      const formData = new FormData();
      formData.append("data", data.file);
      const res = await instance.post("/images", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    onSuccess: () => {
      addToast({
        title: "Imagen subida correctamente",
        color: "success",
      });
      onConfirm?.();
      onClose();
    },
    onError: () => {
      addToast({
        title: "Error al subir la imagen",
        color: "danger",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <ModalHeader>Subir imagenes a la galeria</ModalHeader>
            <ModalBody>
              <div
                {...divProps}
                onClick={onClickInput}
                style={{
                  border: isOver ? "2px solid blue" : "2px dashed gray",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <input
                  {...inputProps}
                  type="file"
                  style={{ display: "none" }}
                />
                {fileWatch ? (
                  <Image src={URL.createObjectURL(fileWatch)} alt="Preview" />
                ) : (
                  "Arrastra y suelta una imagen aquí, o haz clic para seleccionar"
                )}
              </div>

              {errors.file && (
                <p className="text-red-500 mt-2">{errors.file.message}</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="bordered"
                onPress={onClose}
                type="button"
                className="font-semibold"
              >
                Cancelar
              </Button>
              <Button color="primary" type="submit" className="ml-2">
                Subir Imagen
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
