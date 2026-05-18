import { instance } from "@/config/axios";
import { ResponseBooking } from "@/interface/response.interface";
import { ApiResponse } from "@/interface/utils.interface";
import { errorWrapper } from "@/utils/errorWrapper";
import { notFound } from "next/navigation";
import ReservePage from "./ReservePage";
import { BookingProvider } from "@/context/BookingProvider";

export default async function Reserver({
  searchParams,
}: {
  searchParams: Promise<{
    origin: string;
    destination: string;
    checkIn: string;
  }>;
}) {
  const { origin, destination, checkIn } = await searchParams;

  const [error, data] = await errorWrapper(async () => {
    const res = await instance.get<ApiResponse<ResponseBooking>>(
      "/public/booking/destinations",
      {
        params: {
          origin,
          destination,
          checkIn,
        },
      },
    );

    return res.data;
  });

  if (error) {
    return <div></div>;
  }

  return (
    <BookingProvider response={data!.body}>
      <ReservePage />
    </BookingProvider>
  );
}
