import ImageGalleryModal from "@/components/ui/image-galery/ImageGalery";
import Mapa from "@/components/ui/map/Map";
import { ENV } from "@/config/env";
import type { ResponseGalery } from "@/interface/response.interface";
import type { ModalProps } from "@/interface/utils.interface";
import {
  ExperienceSchema,
  Types,
  type ExperienceType,
} from "@/schemas/destinations/experience.schema";
import { parseErrors } from "@/utils/parseErrors";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { LuImage, LuTrash } from "react-icons/lu";

interface ExperienceModalProps extends Omit<ModalProps, "onConfirm"> {
  onConfirm: (data: ExperienceType) => void;
  data: ExperienceType;
}

export default function UpdateExperienceModal({
  isOpen,
  onClose,
  onConfirm,
  data,
}: ExperienceModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(ExperienceSchema),
    defaultValues: data,
  });

  const [selectedHeroImage, setSelectedHeroImage] =
    useState<ResponseGalery | null>(
      data.imageId
        ? ({
            imageId: data.imageId,
            imageUrl: data.imagePath,
          } as ResponseGalery)
        : null,
    );
  const {
    isOpen: isImgGalleryOpen,
    onOpen: onImgGalleryOpen,
    onOpenChange: onImgGalleryOpenChange,
  } = useDisclosure();
  const handleImageSelect = (image: ResponseGalery) => {
    setValue("imagePath", image.imageUrl, { shouldValidate: true });
    setValue("imageId", image.imageId, { shouldValidate: true });
    setSelectedHeroImage(image);
  };

  const watchLat = useWatch({
    control,
    name: "lat",
  });

  const watchLng = useWatch({
    control,
    name: "lng",
  });

  // Remove useEffect that overwrote default values

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Actualizar experiencia</ModalHeader>
            <Form
              onSubmit={handleSubmit((data) => {
                onConfirm(data);
                onClose();
              })}
              validationErrors={parseErrors(errors)}
            >
              <ModalBody className="w-full max-h-96 overflow-y-auto">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Tipo"
                      placeholder="Selecciona un tipo"
                      labelPlacement="outside-top"
                      {...field}
                    >
                      {Types.map((type) => (
                        <SelectItem key={type.value}>{type.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                />

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Nombre"
                      placeholder="Nombre de la experiencia"
                      labelPlacement="outside-top"
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Descripción"
                      placeholder="Descripción de la experiencia"
                      labelPlacement="outside-top"
                      {...field}
                    />
                  )}
                />

                <div className="flex flex-col gap-2">
                  <span className="text-small font-medium text-foreground">
                    Imagen Principal
                  </span>
                  {selectedHeroImage ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-primary group bg-default-100">
                      <Image
                        src={ENV.API_URL + selectedHeroImage.imageUrl}
                        alt="Blog Image"
                        classNames={{
                          wrapper: "w-full h-full",
                          img: "w-full h-full object-cover",
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          isIconOnly
                          size="sm"
                          color="primary"
                          onPress={onImgGalleryOpen}
                        >
                          <LuImage size={16} />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          onPress={() => {
                            setValue("imageId", 0, { shouldValidate: true });
                            setSelectedHeroImage(null);
                          }}
                        >
                          <LuTrash size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-full h-14 border-2 border-dashed border-default-300 rounded-lg flex items-center justify-center gap-2 text-default-400 cursor-pointer hover:border-primary hover:text-primary transition-colors bg-default-50"
                      onClick={onImgGalleryOpen}
                    >
                      <LuImage size={20} />
                      <span>Seleccionar Imagen</span>
                    </div>
                  )}
                  {errors.imageId?.message && (
                    <span className="text-tiny text-danger">
                      {errors.imageId?.message}
                    </span>
                  )}
                </div>

                <Mapa
                  disableHeader
                  position={{
                    lat: Number(watchLat) || -12.0464,
                    lng: Number(watchLng) || -77.0428,
                  }}
                  setPosistion={(position) => {
                    setValue("lat", String(position.lat));
                    setValue("lng", String(position.lng));
                  }}
                  style={{
                    minHeight: "450px",
                    borderRadius: "0px",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose} type="button">
                  Cancelar
                </Button>

                <Button color="primary" className="ml-2" type="submit">
                  Actualizar
                </Button>
              </ModalFooter>
            </Form>
          </>
        )}
      </ModalContent>

      <ImageGalleryModal
        isOpen={isImgGalleryOpen}
        onClose={onImgGalleryOpenChange}
        onSelect={handleImageSelect}
      />
    </Modal>
  );
}
