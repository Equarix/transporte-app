import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Image,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { LuImage, LuUpload, LuCheck } from "react-icons/lu";
import { instance } from "@/libs/axios";
import type {
  ApiResponse,
  ResponseGalery,
} from "@/interface/response.interface";
import { addToast } from "@heroui/react";
import { ENV } from "@/config/env";
import { useAuth } from "@/components/providers/AuthContext";
import Load from "../load/Load";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: ResponseGalery) => void;
  imageId?: number;
}

export default function ImageGalleryModal({
  isOpen,
  onClose,
  onSelect,
  imageId,
}: ImageGalleryModalProps) {
  const { token } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"select" | "upload">("select");
  const [images, setImages] = useState<ResponseGalery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ResponseGalery | null>(
    null,
  );

  useEffect(() => {
    if (imageId) {
      const defaultImage =
        images.find((img) => img.imageId === imageId) || null;
      setSelectedImage(defaultImage);
    }
  }, [images, imageId]);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const res = await instance.get<ApiResponse<ResponseGalery[]>>("/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data && Array.isArray(res.data.body)) {
        setImages(res.data.body);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      addToast({
        title: "Error al cargar imágenes",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && selectedTab === "select") {
      fetchImages();
    }
  }, [isOpen, selectedTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await instance.post<ApiResponse<ResponseGalery>>(
        "/images",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      addToast({
        title: "Imagen subida correctamente",
        color: "success",
      });

      // Clear file
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Switch to select tab and refresh
      setSelectedTab("select");
      await fetchImages();

      // Optionally auto-select the new image
      if (res.data && res.data.body) {
        setSelectedImage(res.data.body);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      addToast({
        title: "Error al subir imagen",
        color: "danger",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
      // Reset
      setSelectedImage(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent className="h-[70vh]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Galería de Imágenes
            </ModalHeader>
            <ModalBody>
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) =>
                  setSelectedTab(key as "select" | "upload")
                }
                color="primary"
                variant="underlined"
              >
                <Tab
                  key="select"
                  title={
                    <div className="flex items-center gap-2">
                      <LuImage />
                      <span>Seleccionar</span>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-4 mt-4 h-full">
                    {isLoading ? (
                      <Load loading={true} />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((img) => (
                          <div
                            key={img.imageId}
                            className={`
                              cursor-pointer rounded-lg border-2 overflow-hidden relative group
                              ${
                                selectedImage?.imageId === img.imageId
                                  ? "border-primary ring-2 ring-primary ring-offset-2"
                                  : "border-default-200 hover:border-primary/50"
                              }
                            `}
                            onClick={() => setSelectedImage(img)}
                          >
                            <Image
                              src={ENV.API_URL + img.imageUrl}
                              alt={`Image ${img.imageId}`}
                              classNames={{
                                wrapper: "w-full aspect-square",
                                img: "w-full h-full object-cover",
                              }}
                            />
                            {selectedImage?.imageId === img.imageId && (
                              <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-lg z-10">
                                <LuCheck size={16} />
                              </div>
                            )}
                          </div>
                        ))}
                        {images.length === 0 && (
                          <div className="col-span-full py-10 text-center text-default-400">
                            No hay imágenes disponibles. Sube una nueva.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Tab>
                <Tab
                  key="upload"
                  title={
                    <div className="flex items-center gap-2">
                      <LuUpload />
                      <span>Subir Imagen</span>
                    </div>
                  }
                >
                  <div className="flex flex-col items-center justify-center gap-6 h-full min-h-75 border-2 border-dashed border-default-300 rounded-lg bg-default-50 m-4">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                    />

                    {!file ? (
                      <>
                        <div className="p-4 rounded-full bg-default-100 text-default-500">
                          <LuUpload size={48} />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-medium">
                            Click para seleccionar
                          </p>
                          <p className="text-sm text-default-400">
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                        <Button
                          color="primary"
                          onPress={() => fileInputRef.current?.click()}
                        >
                          Seleccionar Archivo
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-primary/10 text-primary">
                          <LuImage size={48} />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-medium text-default-800">
                            {file.name}
                          </p>
                          <p className="text-sm text-default-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            color="danger"
                            variant="light"
                            onPress={() => {
                              setFile(null);
                              if (fileInputRef.current)
                                fileInputRef.current.value = "";
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            color="primary"
                            onPress={handleUpload}
                            isLoading={isUploading}
                          >
                            Subir Imagen
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              {selectedTab === "select" && (
                <Button
                  color="primary"
                  onPress={handleConfirmSelection}
                  isDisabled={!selectedImage}
                >
                  Seleccionar
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
