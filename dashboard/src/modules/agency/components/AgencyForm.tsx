import Header from "@/components/layouts/header/Header";
import Container from "@/components/ui/container/Container";
import FormSection from "@/components/ui/form/FormSection";
import ImageGalleryModal from "@/components/ui/image-galery/ImageGalery";
import Load from "@/components/ui/load/Load";
import Mapa from "@/components/ui/map/Map";
import { ENV } from "@/config/env";
import { parseErrors } from "@/utils/parseErrors";
import { Button, Form, Image, Input, Textarea } from "@heroui/react";
import { Controller } from "react-hook-form";
import { LuImage, LuInfo, LuMapPin, LuPlus, LuSave, LuTrash } from "react-icons/lu";
import { useAgencyForm } from "@/modules/agency/hooks/useAgencyForm";
import type { ResponseAgency } from "@/interface/response.interface";

interface AgencyFormProps {
  initialData?: ResponseAgency;
  isUpdate?: boolean;
}

export default function AgencyForm({
  initialData,
  isUpdate = false,
}: AgencyFormProps) {
  const {
    form: {
      control,
      formState: { errors },
      setValue,
    },
    handleSubmit,
    isPending,
    watchLat,
    watchLng,
    selectedHeroImage,
    setSelectedHeroImage,
    isImgGalleryOpen,
    onImgGalleryOpen,
    onImgGalleryOpenChange,
    handleImageSelect,
  } = useAgencyForm({ initialData, isUpdate });

  return (
    <Form
      onSubmit={handleSubmit}
      className="w-full"
      validationErrors={parseErrors(errors)}
    >
      <Load loading={isPending} />
      <Container className="mx-auto space-y-2">
        <Header
          text={{
            header: isUpdate ? "Actualizar Agencia" : "Crear Agencia",
            button: isUpdate ? "Actualizar" : "Crear",
          }}
          icon={isUpdate ? <LuSave className="size-5" /> : <LuPlus className="size-5" />}
          type="submit"
          className={{
            button: "px-8 h-12 shadow-md hover:shadow-lg transition-all",
          }}
        />
        <div className="flex flex-col gap-8">
          <FormSection
            title="Información General"
            description="Detalles básicos para identificar la agencia"
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
                    placeholder="Nombre de la Agencia"
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
                name="address"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Dirección"
                    placeholder="Dirección de la Agencia"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.address}
                    errorMessage={errors.address?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Teléfono"
                    placeholder="Teléfono de la Agencia"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="max-w-full"
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone?.message}
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
                      alt="Agency Image"
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

              <Controller
                control={control}
                name="largeAddress"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Dirección Larga"
                    placeholder="Dirección Larga de la Agencia"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    className="col-span-1 md:col-span-2"
                    isInvalid={!!errors.largeAddress}
                    errorMessage={errors.largeAddress?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Descripción"
                    className="col-span-1 md:col-span-2"
                    placeholder="Descripción de la Agencia"
                    labelPlacement="outside"
                    variant="bordered"
                    radius="lg"
                    size="lg"
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                  />
                )}
              />
            </div>
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
        <ImageGalleryModal
          isOpen={isImgGalleryOpen}
          onClose={onImgGalleryOpenChange}
          onSelect={handleImageSelect}
        />
      </Container>
    </Form>
  );
}
