import { Card, CardFooter, Image, Button, useDisclosure } from "@heroui/react";
import type {
  ApiResponse,
  ResponseGalery,
} from "@/interface/response.interface";
import { instance } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { ENV } from "@/config/env";
import UploadGalery from "./upload/UploadGalery";
import Title from "@/components/ui/title/Title";
import { useAuth } from "@/components/providers/AuthContext";

export default function GaleryPage() {
  const { token } = useAuth();
  const { data, refetch } = useQuery<ApiResponse<ResponseGalery[]>>({
    queryKey: ["galery"],
    queryFn: async () => {
      const res = await instance.get("/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <header className="flex items-center justify-between">
        <Title>Galeria de Imagenes</Title>

        <Button color="primary" className="font-semibold" onPress={onOpen}>
          <LuPlus size={16} />
          Agregar Imagen
        </Button>
      </header>

      <section className="w-full grid grid-cols-4 gap-2 mt-4">
        {data?.body.map((u) => (
          <Card isFooterBlurred className="border-none" radius="lg">
            <Image
              src={ENV.API_URL + u.imageUrl}
              className="min-w-full max-h-71.25 h-full object-cover"
              classNames={{
                wrapper: "max-w-none!",
              }}
            />
            <CardFooter className="justify-between bg-black/20 before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%-8px)] shadow-small ml-1 z-10">
              <p className="font-semibold text-1xl text-white/80">
                {u.imageName.split("-").slice(1).join("_")}
              </p>
              <Button
                className="text-tiny text-white bg-black/20"
                color="default"
                radius="lg"
                size="sm"
                variant="flat"
              >
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <UploadGalery
        isOpen={isOpen}
        onClose={onOpenChange}
        onConfirm={refetch}
      />
    </div>
  );
}
