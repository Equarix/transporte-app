import { useAuth } from "@/components/providers/AuthContext";
import type {
  ResponseGalery,
  ResponseDestination,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  DestinationsSchema,
  type DestinationsType,
} from "@/schemas/destinations/destinations.schema";
import type { ExperienceType } from "@/schemas/destinations/experience.schema";
import { addToast, useDisclosure } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";

interface UseDestinationFormProps {
  initialData?: ResponseDestination;
  isUpdate?: boolean;
}

export function useDestinationForm({
  initialData,
  isUpdate = false,
}: UseDestinationFormProps = {}) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(DestinationsSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          shortDescription: initialData.shortDescription,
          longDescription: initialData.longDescription,
          lat: initialData.lat,
          lng: initialData.lng,
          imageId: initialData.galery.imageId,
          experiences: initialData.experiences.map((ex) => ({
            type: ex.type as any,
            name: ex.name,
            description: ex.description,
            lat: ex.lat,
            lng: ex.lng,
            imageId: ex.galery.imageId,
            imagePath: ex.galery.imageUrl,
          })),
        }
      : {
          name: "",
          imageId: 0,
          longDescription: "",
          shortDescription: "",
          lat: "-12.0464",
          lng: "-77.0428",
          experiences: [],
        },
  });

  const [selectedHeroImage, setSelectedHeroImage] =
    useState<ResponseGalery | null>(initialData ? initialData.galery : null);

  const watchLat = useWatch({
    control: form.control,
    name: "lat",
  });

  const watchLng = useWatch({
    control: form.control,
    name: "lng",
  });

  const {
    isOpen: isImgGalleryOpen,
    onOpen: onImgGalleryOpen,
    onOpenChange: onImgGalleryOpenChange,
  } = useDisclosure();

  const handleImageSelect = (image: ResponseGalery) => {
    form.setValue("imageId", image.imageId, { shouldValidate: true });
    setSelectedHeroImage(image);
  };

  const {
    isOpen: isExperienceModalOpen,
    onOpen: onExperienceModalOpen,
    onOpenChange: onExperienceModalOpenChange,
  } = useDisclosure();

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  const handleExperienceConfirm = (experience: ExperienceType) => {
    append(experience);
  };

  const [updateExperience, setUpdateExperience] = useState({
    value: null as ExperienceType | null,
    index: null as number | null,
  });

  const {
    isOpen: isUpdateExperienceModalOpen,
    onOpen: onUpdateExperienceModalOpen,
    onOpenChange: onUpdateExperienceModalOpenChange,
  } = useDisclosure();

  const handleUpdateExperience = (
    experience: ExperienceType,
    index: number,
  ) => {
    update(index, experience);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: DestinationsType) => {
      if (isUpdate && initialData) {
        const response = await instance.patch(
          `/destination/${initialData.destinationId}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        return response.data;
      } else {
        const response = await instance.post("/destination", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }
    },
    onSuccess: () => {
      addToast({
        title: isUpdate
          ? "Destino Actualizado Correctamente"
          : "Destino Creado Correctamente",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      navigate("/destinations");
    },
    onError: () => {
      addToast({
        title: isUpdate
          ? "Error al actualizar el destino"
          : "Error al crear el destino",
        color: "danger",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    mutate(data);
  });

  return {
    form,
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
    append,
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
  };
}
