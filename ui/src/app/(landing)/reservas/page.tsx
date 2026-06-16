import { instance } from "@/config/axios";
import { ResponseBooking, Destination } from "@/interface/response.interface";
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

  const defaultDestination: Destination = {
    destinationId: 0,
    name: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    lat: "0",
    lng: "0",
    status: false,
  };

  const bookingResponse: ResponseBooking = data?.body || {
    origin: defaultDestination,
    destination: defaultDestination,
    reservations: [],
  };

  return (
    <BookingProvider response={bookingResponse}>
      <ReservePage />
    </BookingProvider>
  );
}
