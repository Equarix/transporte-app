import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import Mapa from "@/components/ui/map/Map";
import { Button, Form, Image, Input, Textarea } from "@heroui/react";
import {
  LuPlus,
  LuInfo,
  LuMapPin,
  LuImage,
  LuTrash,
  LuPencil,
  LuSave,
} from "react-icons/lu";
import FormSection from "@/components/ui/form/FormSection";
import { ENV } from "@/config/env";
import ImageGalleryModal from "@/components/ui/image-galery/ImageGalery";
import ExperienceModal from "@/modules/destinations/components/ExperienceModal";
import { Controller } from "react-hook-form";
import Table from "@/components/ui/table/Table";
import { Types } from "@/schemas/destinations/experience.schema";
import UpdateExperienceModal from "@/modules/destinations/components/UpdateExperienceModal";
import Load from "@/components/ui/load/Load";
import { useDestinationForm } from "@/modules/destinations/hooks/useDestinationForm";
import type { ResponseDestination } from "@/interface/response.interface";
import { parseErrors } from "@/utils/parseErrors";

interface DestinationFormProps {
  initialData?: ResponseDestination;
  isUpdate?: boolean;
}

export default function DestinationForm({
  initialData,
  isUpdate = false,
}: DestinationFormProps) {
  const {
    form: {
      control,
      formState: { errors },
      setValue,
    },
    watchLat,
    watchLng,
    selectedHeroImage,
    setSelectedHeroImage,
    isImgGalleryOpen,
    onImgGalleryOpen,
    onImgGalleryOpenChange,
    handleImageSelect,
    isExperienceModalOpen,
    onOpen: onExperienceModalOpen,
    onOpenChange: onExperienceModalOpenChange,
    fields,
    remove,
    handleExperienceConfirm,
    updateExperience,
    setUpdateExperience,
    isUpdateExperienceModalOpen,
    onUpdateExperienceModalOpen,
    onUpdateExperienceModalOpenChange,
    handleUpdateExperience,
    handleSubmit,
    isPending,
  } = useDestinationForm({ initialData, isUpdate });

  return (
    <Form
      className="w-full"
      onSubmit={handleSubmit}
      validationErrors={parseErrors(errors)}
    >
      <Load loading={isPending} />
      <Container className="mx-auto space-y-2">
        <Header
          text={{
            header: isUpdate ? "Actualizar Destino" : "Crear Destino",
            button: isUpdate ? "Actualizar" : "Crear",
          }}
          icon={
            isUpdate ? (
              <LuSave className="size-5" />
            ) : (
              <LuPlus className="size-5" />
            )
          }
          type="submit"
          className={{
            button: "px-8 h-12 shadow-md hover:shadow-lg transition-all",
          }}
        />

        <div className="flex flex-col gap-8">
          <FormSection
            title="Información General"
            description="Detalles básicos para identificar el destino"
            icon={<LuInfo className="size-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nombre"
                    placeholder="Nombre del destino"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="shortDescription"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Descripción Corta"
                    placeholder="Una breve reseña del destino"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.shortDescription}
                    errorMessage={errors.shortDescription?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="longDescription"
                render={({ field }) => (
                  <Textarea
                    className="col-span-1 md:col-span-2"
                    {...field}
                    label="Descripción Larga"
                    placeholder="Describe detalladamente este destino"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    minRows={4}
                    isInvalid={!!errors.longDescription}
                    errorMessage={errors.longDescription?.message}
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
            </div>
          </FormSection>

          <FormSection
            title="Experiencias y Otros"
            description=""
            icon={<LuMapPin className="size-5" />}
            headerAction={
              <Button
                color="primary"
                variant="flat"
                startContent={<LuPlus />}
                onPress={onExperienceModalOpen}
                type="button"
              >
                Añadir
              </Button>
            }
          >
            {fields.length == 0 ? (
              <p>No hay elementos</p>
            ) : (
              <Table
                data={fields}
                columns={[
                  {
                    header: "Imagen",
                    cell: ({ row }) => {
                      const { imagePath } = row.original;
                      return (
                        <Image
                          src={ENV.API_URL + imagePath}
                          alt="Blog Image"
                          classNames={{
                            wrapper: "w-full h-full",
                            img: "w-full h-full max-h-[80px] object-cover",
                          }}
                        />
                      );
                    },
                  },
                  {
                    header: "Tipo",
                    accessorFn: ({ type }) =>
                      Types.find((t) => t.value == type)?.label,
                  },
                  {
                    header: "Título",
                    accessorKey: "name",
                  },
                  {
                    header: "Descripción",
                    accessorKey: "description",
                  },
                  {
                    header: "Acciones",
                    cell: ({ row }) => {
                      const { index } = row;
                      return (
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            onPress={() => remove(index)}
                          >
                            <LuTrash size={16} />
                          </Button>

                          <Button
                            isIconOnly
                            size="sm"
                            color="primary"
                            onPress={() => {
                              setUpdateExperience({
                                value: row.original as any,
                                index,
                              });
                              onUpdateExperienceModalOpen();
                            }}
                          >
                            <LuPencil size={16} />
                          </Button>
                        </div>
                      );
                    },
                  },
                ]}
              />
            )}
          </FormSection>

          <FormSection
            title="Ubicación"
            description="Selecciona la ubicación exacta en el mapa"
            icon={<LuMapPin className="size-5" />}
            contentClassName="p-0 overflow-hidden"
          >
            <Mapa
              disableHeader
              position={{
                lat: Number(watchLat) || -12.0464,
                lng: Number(watchLng) || -77.0428,
              }}
              setPosistion={(position) => {
                setValue("lat", position.lat.toString());
                setValue("lng", position.lng.toString());
              }}
              style={{
                height: "450px",
                borderRadius: "0px",
              }}
            />
          </FormSection>
        </div>
      </Container>

      <ImageGalleryModal
        isOpen={isImgGalleryOpen}
        onClose={onImgGalleryOpenChange}
        onSelect={handleImageSelect}
      />

      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={onExperienceModalOpenChange}
        onConfirm={handleExperienceConfirm}
        defaultLat={watchLat}
        defaultLng={watchLng}
      />

      {updateExperience.value && (
        <UpdateExperienceModal
          isOpen={isUpdateExperienceModalOpen}
          onClose={onUpdateExperienceModalOpenChange}
          onConfirm={(data) =>
            handleUpdateExperience(data, updateExperience.index!)
          }
          data={updateExperience.value as any}
        />
      )}
    </Form>
  );
}
