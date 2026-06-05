"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaDownload, FaBus, FaHotel } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TicketPDFDocument } from "@/components/modules/reserver/TicketPDFDocument";
import { ResponseSaveReserver } from "@/interface/save-reserver.interface";

interface SavedBookingData extends ResponseSaveReserver {
  originName?: string;
  destinationName?: string;
}

export default function ReservationCompletedPage() {
  const [bookingData, setBookingData] = useState<SavedBookingData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("lastBookingResult");
    if (saved) {
      try {
        setBookingData(JSON.parse(saved).body);
      } catch (e) {
        console.error("Error parsing last booking result:", e);
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#f8f6f4] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="text-center py-20 text-gray-400 font-bold">
          Cargando confirmación...
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#f8f6f4] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            No se encontró reserva reciente
          </h1>
          <p className="text-gray-500 mb-8">
            Parece que no tienes un comprobante de pago generado recientemente en esta sesión.
          </p>
          <Link href="/">
            <button className="bg-[#e87722] hover:bg-[#d96a1a] text-white font-bold py-4 px-8 rounded-xl transition-all">
              VOLVER AL INICIO
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const totalAmount =
    (bookingData.saleDetails?.reduce((acc, detail) => acc + (detail.amount || 0), 0) || 0) +
    (bookingData.hotelDetails?.reduce((acc, detail) => acc + (detail.amount || 0), 0) || 0);

  return (
    <div className="min-h-screen bg-[#f8f6f4] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fdf5f0] to-white z-0"></div>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#e87722]/5 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            ¡Viaje <span className="text-[#8b5a2b]">Confirmado!</span>
          </h1>
          <p className="text-gray-500 max-w-lg mb-10 text-lg">
            Tu pago ha sido procesado con éxito. Hemos generado los detalles de tu boleto a continuación.
          </p>

          {/* Ticket Summary Card */}
          <div className="w-full bg-[#f8f6f4] rounded-3xl p-6 md:p-8 text-left border border-gray-100 mb-10 relative">
            {/* Cutouts for ticket effect */}
            <div className="absolute -left-4 top-[140px] w-8 h-8 bg-white rounded-full border-r border-gray-100"></div>
            <div className="absolute -right-4 top-[140px] w-8 h-8 bg-white rounded-full border-l border-gray-100"></div>
            <div className="absolute left-4 right-4 top-[156px] border-t-2 border-dashed border-gray-200"></div>

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8b5a2b]/10 flex items-center justify-center text-[#8b5a2b]">
                  <FaBus />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Código de Reserva
                  </p>
                  <p className="font-black text-gray-900 tracking-wider text-lg">
                    ETF-{bookingData.saleId}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Total Pagado
                </p>
                <p className="font-black text-[#e87722] text-xl">
                  S/ {totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10 pb-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Origen
                </p>
                <p className="font-bold text-gray-900 uppercase">
                  {bookingData.originName || "TRUJILLO"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Destino
                </p>
                <p className="font-bold text-gray-900 uppercase">
                  {bookingData.destinationName || "LIMA"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Fecha Operación
                </p>
                <p className="font-bold text-gray-900">
                  {formattedDate(bookingData.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Estado
                </p>
                <p className="font-bold text-green-600 uppercase">
                  {bookingData.status || "APROBADO"}
                </p>
              </div>
            </div>

            {/* Passengers */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Pasajeros
              </p>
              <div className="flex flex-col gap-3">
                {bookingData.saleDetails?.map((detail) => (
                  <div
                    key={detail.saleDetailId}
                    className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-3 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-black text-gray-900">{detail.name}</p>
                      <p className="text-xs text-gray-400 font-bold">
                        {detail.documentType}: {detail.documentNumber}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-[#f0e6dc] text-[#8b5a2b] px-3 py-1 rounded-full font-bold">
                        Piso {detail.floor}
                      </span>
                      <span className="bg-[#f0e6dc] text-[#8b5a2b] px-3 py-1 rounded-full font-bold">
                        Asiento {detail.row}-{detail.column} ({detail.typeSeat})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Option details if any */}
            {bookingData.hotelDetails && bookingData.hotelDetails.length > 0 && (
              <div className="pt-8 mt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <FaHotel className="text-[#8b5a2b]" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Estancia de Hotel Adicional
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {bookingData.hotelDetails.map((hotel) => (
                    <div
                      key={hotel.hotelDetailId}
                      className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-4 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div>
                        <p className="font-black text-gray-900">{hotel.hotelName}</p>
                        <p className="text-xs text-gray-400 font-bold">
                          Huésped: {hotel.clientName}
                        </p>
                        <div className="text-xs text-gray-500 mt-1 flex gap-4">
                          <span>
                            <strong>Entrada:</strong> {hotel.checkIn}
                          </span>
                          <span>
                            <strong>Salida:</strong> {hotel.checkOut}
                          </span>
                        </div>
                      </div>
                      <p className="font-black text-amber-700 shrink-0 text-base">
                        S/ {(hotel.amount || 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Sales Points if any */}
            {bookingData.salesPoints && (
              <div className="pt-8 mt-8 border-t border-gray-200">
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">
                        PUNTOS ENTRAFESA GANADOS
                      </p>
                      <p className="text-sm font-bold text-amber-900 mt-0.5">
                        ¡Felicidades! Has acumulado puntos por esta compra.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#d97706] text-white font-black text-lg px-4 py-2 rounded-2xl shadow-sm tracking-wide shrink-0">
                    +{bookingData.salesPoints.points} PTS
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <PDFDownloadLink
              document={<TicketPDFDocument data={bookingData} />}
              fileName={`boletos-ETF-${bookingData.saleId}.pdf`}
              className="flex-1"
            >
              {({ loading }) => (
                <button
                  disabled={loading}
                  className="w-full bg-white border-2 border-gray-100 hover:bg-gray-50 text-gray-700 font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <FaDownload className="text-gray-400" />
                  {loading ? "GENERANDO PDF..." : "DESCARGAR BOLETO"}
                </button>
              )}
            </PDFDownloadLink>

            <Link href="/" className="flex-1">
              <button className="w-full bg-[#e87722] hover:bg-[#d96a1a] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                VOLVER AL INICIO
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
