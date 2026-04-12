import { useAuth } from "@/components/providers/AuthContext";
import type { ResponseGalery } from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import {
  DestinationsSchema,
  type DestinationsType,
} from "@/schemas/destinations/destinations.schema";
import type { ExperienceType } from "@/schemas/destinations/experience.schema";
import { addToast, useDisclosure } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";

export function useCreateDestinations() {
  const form = useForm({
    resolver: zodResolver(DestinationsSchema),
  });

  const watchLat = useWatch({
    control: form.control,
    name: "lat",
  });

  const watchLng = useWatch({
    control: form.control,
    name: "lng",
  });

  const [selectedHeroImage, setSelectedHeroImage] =
    useState<ResponseGalery | null>(null);
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
  const navigate = useNavigate();
  const { token } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: DestinationsType) => {
      const response = await instance.post("/destination", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      addToast({
        title: "Destino Creado Correctamente",
        color: "success",
      });
      navigate("/destinations");
    },
    onError: () => {
      addToast({
        title: "Error al crear el destino",
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
    onExperienceModalOpen,
    onExperienceModalOpenChange,
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
