import { useAuth } from "@/components/providers/AuthContext";
import type { ResponseAgency, ResponseGalery } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { AgencySchema, type AgencySchemaType } from "@/schemas/agency/agency.schema";
import { addToast, useDisclosure } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";

interface UseAgencyFormProps {
  initialData?: ResponseAgency;
  isUpdate?: boolean;
}

export function useAgencyForm({
  initialData,
  isUpdate = false,
}: UseAgencyFormProps = {}) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm<AgencySchemaType>({
    resolver: zodResolver(AgencySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          address: initialData.address,
          phone: initialData.phone,
          description: initialData.description,
          lat: initialData.lat,
          lng: initialData.lng,
          largeAddress: initialData.largeAddress,
          imageId: initialData.galery.imageId,
          services: initialData.services.map((s) => ({
            name: s.name,
            icon: s.icon,
          })),
        }
      : {
          name: "",
          address: "",
          phone: "",
          description: "",
          lat: "-12.0464",
          lng: "-77.0428",
          largeAddress: "",
          imageId: 0,
          services: [{ name: "", icon: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const watchLat = useWatch({
    control: form.control,
    name: "lat",
  });

  const watchLng = useWatch({
    control: form.control,
    name: "lng",
  });

  const [selectedHeroImage, setSelectedHeroImage] = useState<ResponseGalery | null>(
    initialData ? initialData.galery : null
  );

  const {
    isOpen: isImgGalleryOpen,
    onOpen: onImgGalleryOpen,
    onOpenChange: onImgGalleryOpenChange,
  } = useDisclosure();

  const handleImageSelect = (image: ResponseGalery) => {
    form.setValue("imageId", image.imageId, { shouldValidate: true });
    setSelectedHeroImage(image);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AgencySchemaType) => {
      if (isUpdate && initialData) {
        const response = await instance.patch(
          `/agency/${initialData.agencyId}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      } else {
        const response = await instance.post("/agency", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }
    },
    onSuccess: () => {
      addToast({
        title: isUpdate
          ? "Agencia actualizada correctamente"
          : "Agencia creada correctamente",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      navigate("/agency");
    },
    onError: () => {
      addToast({
        title: isUpdate
          ? "Error al actualizar la agencia"
          : "Error al crear la agencia",
        color: "danger",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data: AgencySchemaType) => {
    mutate(data);
  });

  return {
    form,
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
    fields,
    append,
    remove,
  };
}
