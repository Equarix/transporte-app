import { instance } from "@/config/axios";
import { errorWrapper } from "@/utils/errorWrapper";
import { notFound, redirect } from "next/navigation";
import { ApiResponse } from "@/interface/utils.interface";
import { Destination } from "@/interface/response.interface";
import HeroFindWrapper from "./HeroFindWrapper";

export async function HeroFind() {
  const [error, res] = await errorWrapper(async () => {
    const res = await instance.get<ApiResponse<Destination[]>>(
      "/public/destination",
    );
    return res.data;
  });

  if (error) {
    return notFound();
  }

  return <HeroFindWrapper destinations={res!.body} />;
}
