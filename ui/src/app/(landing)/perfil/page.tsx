"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileForm } from "@/schema/profile.schema";
import { instance } from "@/config/axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ReviewModal from "@/components/modules/review/ReviewModal";
import {
  LuUser,
  LuTicket,
  LuLogOut,
  LuSettings,
  LuPlus,
  LuAward,
  LuClock,
  LuTag,
  LuCreditCard,
  LuCircleAlert,
  LuLock,
  LuShield,
  LuX,
  LuCheck,
  LuCompass,
  LuMapPin,
} from "react-icons/lu";
import { ApiResponse } from "@/interface/utils.interface";
import { Profile, Destination } from "@/interface/response.interface";
import { AxiosError } from "axios";

// Microservice Interfaces
interface SaleDetail {
  saleDetailId: number;
  busId: number;
  seatId: number;
  floor: number;
  row: number;
  column: number;
  amount: number;
  documentNumber: string;
  documentType: string;
  name: string;
  typeSeat: string;
}

interface Alert {
  alertId: number;
  title: string;
  message: string;
  sentAt: string;
}

interface Ticket {
  saleId: number;
  createdAt: string;
  userId: number;
  status: string;
  purchaseFrom: string;
  fromDestinationId: number;
  toDestinationId: number;
  reserverId: number;
  saleDetails: SaleDetail[];
  origin?: {
    destinationId: number;
    name: string;
    shortDescription: string;
    lat: string;
    lng: string;
    slug: string;
  };
  destination?: {
    destinationId: number;
    name: string;
    shortDescription: string;
    lat: string;
    lng: string;
    slug: string;
  };
  reserver?: {
    reserverId: number;
    date: string;
    checkOutHour: string;
    status: string;
    bus?: {
      busId: number;
      plate: string;
    };
    driver?: {
      userId: number;
      firstName: string;
      lastName: string;
    };
  };
  promoCode?: string;
  discount?: number;
}

interface PointMovement {
  pointsUserId: number;
  userId: number;
  points: number;
  createdAt: string;
  pointsFrom: string;
  type: "ADDITION" | "SUBTRACTION";
}

interface UserPointsResponse {
  balance: number;
  movements: PointMovement[];
}

interface ClientPromo {
  promoId: number;
  code: string;
  name: string;
  description: string | null;
  startsAt: string;
  expiresAt: string;
  status: string;
  minimumPurchaseAmount: number;
  discountValue: number | null;
  discountMode: string | null;
}

/* =========================================================
   PAYMENT GATEWAY MODAL
   ========================================================= */
interface PaymentGatewayModalProps {
  ticket: Ticket;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

function PaymentGatewayModal({
  ticket,
  onClose,
  onConfirm,
  isProcessing,
}: PaymentGatewayModalProps) {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [payMethod, setPayMethod] = useState<"card" | "yape" | "efectivo">("card");

  const totalAmount = ticket.saleDetails.reduce(
    (sum, det) => sum + det.amount,
    0,
  );
  const originName = ticket.origin?.name || "Origen";
  const destName = ticket.destination?.name || "Destino";

  const formatCard = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})/g, "$1 ")
      .trim();

  const formatExpiry = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/(\d{2})(\d{0,2})/, "$1/$2");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#5D4037] to-[#8B5E3C] px-6 pt-6 pb-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <LuX className="text-white text-sm" />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <LuCreditCard className="text-white text-lg" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                Entrafesa Pagos
              </p>
              <h2 className="text-base font-black">Completar Pago</h2>
            </div>
          </div>
          {/* Order Summary Strip */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                  Ruta
                </p>
                <p className="font-extrabold text-sm mt-0.5">
                  {originName} → {destName}
                </p>
                <p className="text-[10px] text-white/70 mt-1">
                  Reserva IT-{ticket.saleId} · {ticket.saleDetails.length} pasajero(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                  Total
                </p>
                <p className="text-2xl font-black mt-0.5">
                  S/ {totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Payment Method Selector */}
          <div>
            <p className="text-[10px] font-black text-[#5D4037] uppercase tracking-wider mb-3">
              Método de Pago
            </p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "card", label: "Tarjeta", icon: "💳" },
                { id: "yape", label: "Yape / Plin", icon: "📱" },
                { id: "efectivo", label: "Efectivo", icon: "💵" },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 text-xs font-bold transition-all ${
                    payMethod === m.id
                      ? "border-amber-600 bg-amber-50 text-amber-800"
                      : "border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card Form */}
          {payMethod === "card" && (
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  Número de Tarjeta
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono font-bold text-sm text-gray-700 tracking-widest"
                  />
                  <LuCreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  Nombre en la Tarjeta
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="NOMBRE APELLIDO"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm text-gray-700 uppercase tracking-wider"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                    Vencimiento
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm text-gray-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm text-gray-700 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Yape/Plin QR placeholder */}
          {payMethod === "yape" && (
            <div className="py-6 flex flex-col items-center gap-3 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="w-28 h-28 bg-white rounded-2xl border-2 border-purple-200 flex items-center justify-center shadow-sm">
                <span className="text-5xl">📱</span>
              </div>
              <p className="font-bold text-purple-800 text-sm">Escanea con Yape o Plin</p>
              <p className="text-[10px] text-purple-500 font-medium">
                Al confirmar se generará el código de pago
              </p>
            </div>
          )}

          {/* Efectivo info */}
          {payMethod === "efectivo" && (
            <div className="py-5 flex flex-col items-center gap-3 bg-green-50 rounded-2xl border border-green-100">
              <span className="text-5xl">💵</span>
              <p className="font-bold text-green-800 text-sm">Pago en agencia</p>
              <p className="text-[10px] text-green-600 font-medium text-center max-w-[220px]">
                Presenta el código de reserva IT-{ticket.saleId} en cualquier agencia Entrafesa para pagar en efectivo.
              </p>
            </div>
          )}

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
              <LuLock className="text-green-500" />
              SSL Seguro
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
              <LuShield className="text-green-500" />
              3D Secure
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold">
              <LuCheck className="text-green-500" />
              Encriptado
            </div>
          </div>

          {/* Confirm Button */}
          <button
            id={`confirm-payment-${ticket.saleId}`}
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-black rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Procesando pago...
              </>
            ) : (
              <>
                <LuLock className="text-base" />
                Confirmar Pago · S/ {totalAmount.toFixed(2)}
              </>
            )}
          </button>

          <p className="text-center text-[9px] text-gray-400">
            Al confirmar aceptas los Términos de Servicio de Entrafesa.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout, setUser } = useAuth();

  const activeTab = searchParams.get("tab") || "profile";
  const [interestOriginId, setInterestOriginId] = useState<string>("");
  const [interestDestinationId, setInterestDestinationId] = useState<string>("");
  const [interestTravelDate, setInterestTravelDate] = useState<string>("");
  const [whatsappPhone, setWhatsappPhone] = useState<string>("");
  const [whatsappDestination, setWhatsappDestination] = useState<string>("");

  const { data: destinationsResponse } = useQuery<ApiResponse<Destination[]>>({
    queryKey: ["allDestinations"],
    queryFn: async () => {
      const res = await instance.get<ApiResponse<Destination[]>>("/public/destination");
      return res.data;
    },
  });
  const destinationsList = destinationsResponse?.body || [];

  const { data: alertsResponse } = useQuery<ApiResponse<Alert[]>>({
    queryKey: ["userAlerts"],
    queryFn: async () => {
      const res = await instance.get<ApiResponse<Alert[]>>("/notifications/alerts");
      return res.data;
    },
    enabled: !!user,
  });
  const alertsList = alertsResponse?.body || [];

  const saveInterestMutation = useMutation({
    mutationFn: async (data: { originId: number; destinationId: number; travelDate: string }) => {
      const res = await instance.post("/notifications/interests", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("¡Intereses guardados! Te avisaremos de ofertas personalizadas.");
      queryClient.invalidateQueries({ queryKey: ["userAlerts"] });
    },
    onError: () => {
      toast.error("Error al guardar intereses.");
    }
  });

  const simulateWhatsAppMutation = useMutation({
    mutationFn: async (data: { phone: string; destinationName: string }) => {
      const res = await instance.post("/notifications/whatsapp-simulate", data);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(`Simulación exitosa: WhatsApp enviado a ${res.recipient}`);
      queryClient.invalidateQueries({ queryKey: ["userAlerts"] });
    },
    onError: () => {
      toast.error("Error al simular alerta de WhatsApp.");
    }
  });

  const [subTab, setSubTab] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming",
  );
  const [reviewTicket, setReviewTicket] = useState<Ticket | null>(null);
  const [hasDeclinedReviewThisSession, setHasDeclinedReviewThisSession] =
    useState(false);
  const [paymentModalTicket, setPaymentModalTicket] = useState<Ticket | null>(null);

  // Redirect if not logged in (fallback to middleware check)
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  // Form for Profile Info
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: new Date(),
    },
  });

  // Query: Get Profile Data
  const { data: profileResponse, isLoading: isLoadProfile } = useQuery<
    ApiResponse<Profile>
  >({
    queryKey: ["profileData"],
    queryFn: async () => {
      const res = await instance.get<ApiResponse<Profile>>("/user/profile");
      return res.data;
    },
    enabled: !!user,
  });

  const profile = profileResponse?.body;

  // Sync Form values when profile data is fetched
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth)
          : new Date(),
      });
    }
  }, [profile, reset]);

  // Mutation: Update Profile Info
  const updateProfileMutation = useMutation<
    ApiResponse<Profile>,
    AxiosError<{ message?: string }>,
    ProfileForm
  >({
    mutationFn: async (data: ProfileForm) => {
      const res = await instance.patch<ApiResponse<Profile>>("/user/profile", {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString(),
      });
      return res.data;
    },
    onSuccess: (updatedProfile) => {
      toast.success("Información actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["profileData"] });
      if (user) {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            ...updatedProfile.body,
          },
        });
      }
    },
    onError: () => {
      toast.error("Error al actualizar la información");
    },
  });

  // Query: Get User Points & History
  const { data: pointsData, isLoading: isLoadPoints } = useQuery<
    ApiResponse<UserPointsResponse>
  >({
    queryKey: ["userPoints"],
    queryFn: async () => {
      const res =
        await instance.get<ApiResponse<UserPointsResponse>>("/user/points");
      return res.data;
    },
    enabled: !!user,
  });

  // Query: Get User Tickets
  const { data: tickets, isLoading: isLoadTickets } = useQuery<
    ApiResponse<Ticket[]>
  >({
    queryKey: ["userTickets"],
    queryFn: async () => {
      const res = await instance.get<ApiResponse<Ticket[]>>("/user/tickets");
      return res.data;
    },
    enabled: !!user,
  });

  // Query: Get Active Promos/Coupons
  const { data: promosResponse, isLoading: isLoadPromos } = useQuery<
    ApiResponse<ClientPromo[]>
  >({
    queryKey: ["activePromos"],
    queryFn: async () => {
      const res =
        await instance.get<ApiResponse<ClientPromo[]>>("/promos/active");
      console.log(res);
      return res.data;
    },
    enabled: !!user,
  });

  // Query: Get Pending Reviews
  const { data: pendingReviewsResponse, refetch: refetchPendingReviews } =
    useQuery<ApiResponse<Ticket[]>>({
      queryKey: ["pendingReviews"],
      queryFn: async () => {
        const res =
          await instance.get<ApiResponse<Ticket[]>>("/resenas/pending");
        return res.data;
      },
      enabled: !!user,
    });

  const pendingTickets = pendingReviewsResponse?.body || [];

  // Query: Get Pending Payment Tickets
  const { data: pendingPaymentResponse, isLoading: isLoadPendingPayment } =
    useQuery<ApiResponse<Ticket[]>>({
      queryKey: ["pendingPaymentTickets"],
      queryFn: async () => {
        const res = await instance.get<ApiResponse<Ticket[]>>(
          "/user/pending-tickets",
        );
        return res.data;
      },
      enabled: !!user,
    });

  // Query: Get User Recommendations
  const { data: recommendationsResponse, isLoading: recommendationsIsLoading } = useQuery<
    ApiResponse<Destination[]>
  >({
    queryKey: ["userRecommendations", user?.userId],
    queryFn: async () => {
      const res = await instance.get<ApiResponse<Destination[]>>(
        `/user/${user?.userId}/recommendations`
      );
      return res.data;
    },
    enabled: !!user?.userId,
  });

  // Mutation: Approve (pay) a pending ticket
  const approveTicketMutation = useMutation<
    ApiResponse<{ saleId: number; status: string }>,
    AxiosError<{ message?: string }>,
    number
  >({
    mutationFn: async (saleId: number) => {
      const res = await instance.post<
        ApiResponse<{ saleId: number; status: string }>
      >(`/public/booking/approve/${saleId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("¡Pago confirmado! Tu boleto ha sido aprobado.");
      queryClient.invalidateQueries({ queryKey: ["pendingPaymentTickets"] });
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Error al procesar el pago";
      toast.error(msg);
    },
  });

  useEffect(() => {
    if (
      pendingTickets.length > 0 &&
      !reviewTicket &&
      !hasDeclinedReviewThisSession
    ) {
      setReviewTicket(pendingTickets[0]);
    }
  }, [pendingTickets, reviewTicket, hasDeclinedReviewThisSession]);

  // Mutation: Redeem Points
  const redeemPointsMutation = useMutation<
    ApiResponse<UserPointsResponse>,
    AxiosError<{ message?: string }>,
    { rewardId: string; points: number }
  >({
    mutationFn: async (data: { rewardId: string; points: number }) => {
      const res = await instance.post<ApiResponse<UserPointsResponse>>(
        "/user/points/redeem",
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Recompensa canjeada exitosamente. ¡Revisa tu correo!");
      queryClient.invalidateQueries({ queryKey: ["userPoints"] });
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || "Error al canjear la recompensa";
      toast.error(msg);
    },
  });

  if (!user || isLoadProfile) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#fdfcfb]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-amber-700 border-t-transparent animate-spin"></div>
          <p className="text-[#5D4037] font-semibold">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const setTab = (tab: string) => {
    router.push(`/perfil?tab=${tab}`);
  };

  // Points & Tiers Calculations (Using scale of x100 for mockup loyalty points consistency)
  const databasePoints = pointsData?.body?.balance || 0;
  const currentPoints = databasePoints * 100; // Multiply by 100 for mockup style

  let tierName = "Plata";
  let nextTierName = "Oro";
  let targetPoints = 1000;
  let tierProgress = 0;
  let remainingPoints = 1000;

  if (currentPoints >= 3000) {
    tierName = "Diamante";
    nextTierName = "Max";
    targetPoints = 3000;
    tierProgress = 100;
    remainingPoints = 0;
  } else if (currentPoints >= 2000) {
    tierName = "Platino";
    nextTierName = "Diamante";
    targetPoints = 3000;
    remainingPoints = 3000 - currentPoints;
    tierProgress = Math.round(((currentPoints - 2000) / 1000) * 100);
  } else if (currentPoints >= 1000) {
    tierName = "Oro";
    nextTierName = "Platino";
    targetPoints = 2000;
    remainingPoints = 2000 - currentPoints;
    tierProgress = Math.round(((currentPoints - 1000) / 1000) * 100);
  } else {
    tierName = "Plata";
    nextTierName = "Oro";
    targetPoints = 1000;
    remainingPoints = 1000 - currentPoints;
    tierProgress = Math.round((currentPoints / 1000) * 100);
  }

  // Filter Tickets
  const now = new Date();
  const ticketsList = tickets?.body || [];
  const filteredTickets = ticketsList.filter((ticket) => {
    const tripDate = ticket.reserver?.date
      ? new Date(ticket.reserver.date)
      : new Date(ticket.createdAt);
    if (subTab === "cancelled") {
      return (
        ticket.status.toLowerCase() === "cancelado" ||
        ticket.reserver?.status.toLowerCase() === "cancelled"
      );
    }
    if (subTab === "past") {
      return (
        tripDate < now &&
        ticket.status.toLowerCase() !== "cancelado" &&
        ticket.reserver?.status.toLowerCase() !== "cancelled"
      );
    }
    // upcoming
    return (
      tripDate >= now &&
      ticket.status.toLowerCase() !== "cancelado" &&
      ticket.reserver?.status.toLowerCase() !== "cancelled"
    );
  });

  return (
    <div className="w-full min-h-screen bg-[#fdfcfb] pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar Layout */}
      <aside className="w-full md:w-80 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between shrink-0 h-fit">
        <div>
          {/* User Info Welcome Panel */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-6">
            <div className="size-14 rounded-full bg-[#5D4037] flex items-center justify-center text-white text-xl font-bold shadow-md">
              {profile?.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-700 tracking-wider uppercase opacity-80">
                BIENVENIDO, VIAJERO
              </p>
              <h2 className="text-sm md:text-base font-extrabold text-[#333333] leading-snug line-clamp-2">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-xs font-semibold text-[#8B7E74]">
                Amber Meridian Elite
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-8">
            <button
              onClick={() => setTab("profile")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "profile"
                  ? "bg-[#5D4037] text-white shadow-sm"
                  : "text-[#5D4037] hover:bg-gray-50"
              }`}
            >
              <LuUser className="text-lg" />
              Mi Perfil
            </button>
            <button
              onClick={() => setTab("tickets")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "tickets"
                  ? "bg-[#5D4037] text-white shadow-sm"
                  : "text-[#5D4037] hover:bg-gray-50"
              }`}
            >
              <LuTicket className="text-lg" />
              Mis Reservas
            </button>
            <button
              onClick={() => setTab("rewards")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "rewards"
                  ? "bg-[#5D4037] text-white shadow-sm"
                  : "text-[#5D4037] hover:bg-gray-50"
              }`}
            >
              <LuAward className="text-lg" />
              Puntos y Recompensas
            </button>
            <button
              onClick={() => setTab("coupons")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "coupons"
                  ? "bg-[#5D4037] text-white shadow-sm"
                  : "text-[#5D4037] hover:bg-gray-50"
              }`}
            >
              <LuTag className="text-lg" />
              Mis Cupones
            </button>
            <button
              onClick={() => setTab("recommendations")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "recommendations"
                  ? "bg-[#5D4037] text-white shadow-sm"
                  : "text-[#5D4037] hover:bg-gray-50"
              }`}
            >
              <LuCompass className="text-lg" />
              Recomendaciones
            </button>
            <button
              onClick={() => setTab("pending")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative ${
                activeTab === "pending"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-amber-700 hover:bg-amber-50"
              }`}
            >
              <LuCreditCard className="text-lg" />
              Pagos Pendientes
              {(pendingPaymentResponse?.body?.length ?? 0) > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  {pendingPaymentResponse?.body?.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("settings")}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "settings"
                  ? "bg-[#5D4037] text-white shadow-sm"
                  : "text-[#5D4037] hover:bg-gray-50"
              }`}
            >
              <LuSettings className="text-lg" />
              Configuración
            </button>
          </nav>

          {/* Action Button: Book trip */}
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 bg-linear-to-r from-amber-700 to-amber-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <LuPlus className="text-lg" />
            Reservar Nuevo Viaje
          </button>
        </div>

        {/* Logout at bottom */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 mt-8 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
        >
          <LuLogOut className="text-lg group-hover:translate-x-1 transition-transform" />
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm min-h-[600px]">
        {/* Tab 1: Profile Details */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#333333]">
                Mi Información
              </h1>
              <p className="text-sm text-[#8B7E74] mt-1">
                Actualiza tus datos personales para agilizar tus próximas
                compras de pasajes.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleProfileSubmit)}
              className="space-y-6 max-w-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombres */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">
                    Nombres
                  </label>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:outline-hidden focus:ring-2 focus:ring-[#5D4037]/10 focus:border-[#5D4037] font-semibold text-sm`}
                        placeholder="Nombres"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-xs font-bold text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Apellidos */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">
                    Apellidos
                  </label>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.lastName ? "border-red-500" : "border-gray-200"
                        } focus:outline-hidden focus:ring-2 focus:ring-[#5D4037]/10 focus:border-[#5D4037] font-semibold text-sm`}
                        placeholder="Apellidos"
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-xs font-bold text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                {/* Tipo de Documento (ReadOnly) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider opacity-60">
                    Tipo de Documento
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile?.typeDocument || ""}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 font-semibold text-sm cursor-not-allowed"
                  />
                </div>

                {/* Número de Documento (ReadOnly) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider opacity-60">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    disabled
                    value={profile?.documentNumber || ""}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 font-semibold text-sm cursor-not-allowed"
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.email ? "border-red-500" : "border-gray-200"
                        } focus:outline-hidden focus:ring-2 focus:ring-[#5D4037]/10 focus:border-[#5D4037] font-semibold text-sm`}
                        placeholder="ejemplo@correo.com"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs font-bold text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Teléfono Celular */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">
                    Celular
                  </label>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.phone ? "border-red-500" : "border-gray-200"
                        } focus:outline-hidden focus:ring-2 focus:ring-[#5D4037]/10 focus:border-[#5D4037] font-semibold text-sm`}
                        placeholder="987654321"
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-xs font-bold text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Fecha de Nacimiento */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">
                    Fecha de Nacimiento
                  </label>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <input
                        type="date"
                        value={
                          field.value ? format(field.value, "yyyy-MM-dd") : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.dateOfBirth
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:outline-hidden focus:ring-2 focus:ring-[#5D4037]/10 focus:border-[#5D4037] font-semibold text-sm`}
                      />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs font-bold text-red-500">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || updateProfileMutation.isPending}
                  className="px-8 py-3.5 bg-[#5D4037] text-white font-bold rounded-xl hover:bg-[#4E342E] transition-all disabled:opacity-50 text-sm shadow-sm"
                >
                  {isSubmitting || updateProfileMutation.isPending
                    ? "Guardando cambios..."
                    : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Mis Reservas / Tickets */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#333333]">
                  Mis Reservas
                </h1>
                <p className="text-sm text-[#8B7E74] mt-1">
                  Gestiona tus viajes programados, revisa pasados o cancelados.
                </p>
              </div>
              <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 flex items-center gap-2">
                <LuTicket className="text-amber-700 text-lg" />
                <span className="text-xs font-bold text-[#333333]">
                  TOTAL VIAJES:{" "}
                  <span className="text-amber-800 text-sm">
                    {tickets?.body?.length || 0}
                  </span>
                </span>
              </div>
            </div>

            {/* Sub Tabs: Proximos, Pasados, Cancelados */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setSubTab("upcoming")}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                  subTab === "upcoming"
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Próximos
              </button>
              <button
                onClick={() => setSubTab("past")}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                  subTab === "past"
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Pasados
              </button>
              <button
                onClick={() => setSubTab("cancelled")}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                  subTab === "cancelled"
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Cancelados
              </button>
            </div>

            {/* Tickets Listing */}
            {isLoadTickets ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="size-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                <p className="text-sm text-[#8B7E74]">
                  Buscando tus reservas...
                </p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <LuTicket className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="font-bold text-gray-700">
                  No se encontraron reservas
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  {subTab === "upcoming"
                    ? "Aún no tienes viajes programados para los siguientes días. ¡Reserva un boleto hoy!"
                    : subTab === "past"
                      ? "No tienes viajes completados en tu historial."
                      : "No tienes reservas canceladas."}
                </p>
                {subTab === "upcoming" && (
                  <button
                    onClick={() => router.push("/")}
                    className="mt-4 px-6 py-2.5 bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Buscar Destino
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => {
                  const tripDate = ticket.reserver?.date
                    ? new Date(ticket.reserver.date)
                    : new Date(ticket.createdAt);
                  const formattedDate = format(tripDate, "dd MMM yyyy", {
                    locale: es,
                  });
                  const formattedTime = ticket.reserver?.checkOutHour
                    ? format(
                        new Date(`2026-01-01T${ticket.reserver.checkOutHour}`),
                        "hh:mm a",
                      )
                    : "07:30 PM";

                  const totalAmount = ticket.saleDetails.reduce(
                    (sum, det) => sum + det.amount,
                    0,
                  );
                  const seatsList = ticket.saleDetails
                    .map((det) => `Asiento ${det.seatId}`)
                    .join(", ");

                  const isUpcoming = subTab === "upcoming";
                  const isPast = subTab === "past";
                  const isCancelled = subTab === "cancelled";

                  return (
                    <div
                      key={ticket.saleId}
                      className="bg-white border border-gray-150 rounded-3xl p-6 hover:shadow-lg hover:border-amber-200 transition-all duration-300 flex flex-col gap-5"
                    >
                      {/* Row 1: Header (Status + Reservation ID) */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isCancelled
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : isPast
                                  ? "bg-gray-100 text-gray-500 border border-gray-200"
                                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}
                          >
                            {isCancelled
                              ? "Cancelado"
                              : isPast
                                ? "Viajado"
                                : "Confirmado"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            RESERVA:{" "}
                            <span className="text-gray-700 font-black">
                              IT-{ticket.saleId}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                          <LuClock className="text-amber-600" />
                          <span>
                            {formattedDate} - {formattedTime}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Origin & Destination Connection */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                        {/* Origin */}
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider mb-1">
                            Origen
                          </p>
                          <p className="font-extrabold text-[#333333] text-base leading-tight">
                            {ticket.origin?.name || "Origen"}
                          </p>
                          <p
                            className="text-[10px] text-gray-400 font-medium mt-1 line-clamp-1"
                            title={ticket.origin?.shortDescription}
                          >
                            {ticket.origin?.shortDescription ||
                              "Terminal de origen"}
                          </p>
                        </div>

                        {/* Connection Arrow/Indicator */}
                        <div className="flex flex-row sm:flex-col items-center shrink-0 gap-2 sm:gap-1 px-4">
                          <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Directo
                          </span>
                          <div className="w-16 sm:w-20 h-px bg-amber-200 relative my-1">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                          </div>
                          <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider">
                            Ruta Terrestre
                          </span>
                        </div>

                        {/* Destination */}
                        <div className="flex-1 sm:text-right">
                          <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider mb-1">
                            Destino
                          </p>
                          <p className="font-extrabold text-[#333333] text-base leading-tight">
                            {ticket.destination?.name || "Destino"}
                          </p>
                          <p
                            className="text-[10px] text-gray-400 font-medium mt-1 line-clamp-1"
                            title={ticket.destination?.shortDescription}
                          >
                            {ticket.destination?.shortDescription ||
                              "Terminal de destino"}
                          </p>
                        </div>
                      </div>

                      {/* Row 3: Ticket details & pricing */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            Asiento(s)
                          </p>
                          <p
                            className="font-extrabold text-[#5D4037] text-xs mt-1 truncate"
                            title={seatsList}
                          >
                            {seatsList || "Ninguno asignado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            Servicio
                          </p>
                          <p className="font-extrabold text-gray-700 text-xs mt-1">
                            Premium Imperial
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            Total Pagado
                          </p>
                          <p className="font-black text-amber-800 text-sm mt-0.5">
                            S/{" "}
                            {Math.max(
                              0,
                              totalAmount - (ticket.discount || 0),
                            ).toFixed(2)}
                          </p>
                          {ticket.promoCode && (
                            <p className="text-[9px] text-emerald-600 font-bold mt-1">
                              Cupón: {ticket.promoCode} (-S/{" "}
                              {Number(ticket.discount).toFixed(2)})
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Row 4: Footer Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                        {isUpcoming && (
                          <>
                            <button
                              onClick={() =>
                                router.push(`/reservas/seguimiento?id=${ticket.reserverId}`)
                              }
                              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                            >
                              Seguir Viaje
                            </button>
                            <button
                              onClick={() =>
                                toast.info(
                                  "Comunícate con soporte para reprogramar",
                                )
                              }
                              className="px-5 py-2.5 bg-white border border-gray-200 text-[#5D4037] hover:bg-gray-50 font-bold rounded-xl text-xs transition-all shadow-xs"
                            >
                              Gestionar viaje
                            </button>
                          </>
                        )}
                        {!isCancelled && (
                          <button
                            onClick={() =>
                              toast.success("Mostrando boleto de viaje...")
                            }
                            className="px-5 py-2.5 bg-[#5D4037] hover:bg-[#4E342E] text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                          >
                            Ver Boleto
                          </button>
                        )}
                        {(isPast || isCancelled) && (
                          <button
                            onClick={() =>
                              toast.info(
                                "Detalles de la compra guardados en historial",
                              )
                            }
                            className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold rounded-xl text-xs transition-all"
                          >
                            Ver Detalle
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Pagos Pendientes */}
        {activeTab === "pending" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-[#333333]">
                  Pagos Pendientes
                </h1>
                <p className="text-sm text-[#8B7E74] mt-1">
                  Estas reservas están registradas pero aún no han sido
                  confirmadas. Completa el pago para asegurar tu asiento.
                </p>
              </div>
              {(pendingPaymentResponse?.body?.length ?? 0) > 0 && (
                <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 flex items-center gap-2">
                  <LuCircleAlert className="text-amber-600 text-lg" />
                  <span className="text-xs font-bold text-amber-800">
                    {pendingPaymentResponse?.body?.length} pendiente(s)
                  </span>
                </div>
              )}
            </div>

            {isLoadPendingPayment ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="size-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                <p className="text-sm text-[#8B7E74]">
                  Cargando pagos pendientes...
                </p>
              </div>
            ) : (pendingPaymentResponse?.body?.length ?? 0) === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <LuCreditCard className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="font-bold text-gray-700">Sin pagos pendientes</p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  No tienes reservas pendientes de pago. ¡Excelente!
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 px-6 py-2.5 bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Buscar un viaje
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPaymentResponse?.body?.map((ticket) => {
                  const tripDate = ticket.reserver?.date
                    ? new Date(ticket.reserver.date)
                    : new Date(ticket.createdAt);
                  const formattedDate = format(tripDate, "dd MMM yyyy", {
                    locale: es,
                  });
                  const formattedTime = ticket.reserver?.checkOutHour
                    ? format(
                        new Date(`2026-01-01T${ticket.reserver.checkOutHour}`),
                        "hh:mm a",
                      )
                    : "--:--";
                  const totalAmount = ticket.saleDetails.reduce(
                    (sum, det) => sum + det.amount,
                    0,
                  );
                  const seatsList = ticket.saleDetails
                    .map((det) => `Asiento ${det.seatId}`)
                    .join(", ");
                  const isApproving =
                    approveTicketMutation.isPending &&
                    approveTicketMutation.variables === ticket.saleId;

                  return (
                    <div
                      key={ticket.saleId}
                      className="bg-white border-2 border-amber-200 rounded-3xl p-6 hover:shadow-lg hover:border-amber-400 transition-all duration-300 flex flex-col gap-5 relative overflow-hidden"
                    >
                      {/* Pending stripe decoration */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400" />

                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-50 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                            PENDIENTE DE PAGO
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            RESERVA:{" "}
                            <span className="text-gray-700 font-black">
                              IT-{ticket.saleId}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                          <LuClock className="text-amber-600" />
                          <span>
                            {formattedDate} - {formattedTime}
                          </span>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                        <div className="flex-1">
                          <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider mb-1">
                            Origen
                          </p>
                          <p className="font-extrabold text-[#333333] text-base leading-tight">
                            {ticket.origin?.name || "Origen"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium mt-1 line-clamp-1">
                            {ticket.origin?.shortDescription ||
                              "Terminal de origen"}
                          </p>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center shrink-0 gap-2 sm:gap-1 px-4">
                          <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Directo
                          </span>
                          <div className="w-16 sm:w-20 h-px bg-amber-300 relative my-1">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                          </div>
                          <span className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider">
                            Terrestre
                          </span>
                        </div>

                        <div className="flex-1 sm:text-right">
                          <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider mb-1">
                            Destino
                          </p>
                          <p className="font-extrabold text-[#333333] text-base leading-tight">
                            {ticket.destination?.name || "Destino"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium mt-1 line-clamp-1">
                            {ticket.destination?.shortDescription ||
                              "Terminal de destino"}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-amber-50/60 rounded-2xl p-4 border border-amber-100">
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            Asiento(s)
                          </p>
                          <p
                            className="font-extrabold text-[#5D4037] text-xs mt-1 truncate"
                            title={seatsList}
                          >
                            {seatsList || "Ninguno"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            Pasajeros
                          </p>
                          <p className="font-extrabold text-gray-700 text-xs mt-1">
                            {ticket.saleDetails.length} pasajero(s)
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            Total a Pagar
                          </p>
                          <p className="font-black text-amber-800 text-sm mt-0.5">
                            S/ {totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-100">
                        <p className="text-[10px] text-gray-400 flex-1">
                          Confirma tu pago para asegurar el asiento.
                        </p>
                        <button
                          id={`pay-ticket-${ticket.saleId}`}
                          onClick={() => setPaymentModalTicket(ticket)}
                          className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-black rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                          <LuCreditCard className="text-sm" />
                          Pagar Ahora
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Puntos y Recompensas */}
        {activeTab === "rewards" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-[#333333]">
                Puntos y Recompensas
              </h1>
              <p className="text-sm text-[#8B7E74] mt-1">
                Tu lealtad nos mueve. Acumula Amber Meridian Points en cada
                viaje y desbloquea beneficios exclusivos.
              </p>
            </div>

            {/* Points Status Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Point Balance Card */}
              <div className="md:col-span-2 bg-linear-to-br from-amber-50 to-[#fffbf7] border border-amber-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[160px]">
                <div>
                  <p className="text-[10px] font-black text-amber-700 tracking-wider uppercase opacity-80">
                    TU ESTADO ACTUAL
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-amber-900">
                      {currentPoints}
                    </span>
                    <span className="text-sm font-bold text-amber-700">
                      Amber Points
                    </span>
                  </div>
                </div>

                {/* Progress bar to next level */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-[#5d4037]">
                    <span>Próximo Nivel: {nextTierName}</span>
                    <span>{tierProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-amber-600 to-amber-400 transition-all duration-500"
                      style={{ width: `${tierProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400">
                    {remainingPoints > 0
                      ? `Faltan ${remainingPoints} puntos para subir de nivel`
                      : "¡Has alcanzado el nivel máximo!"}
                  </p>
                </div>
              </div>

              {/* Right Level Tier Badge Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xs">
                <div className="size-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 text-3xl mb-3 border border-amber-100 shadow-sm animate-bounce">
                  <LuAward />
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  MIEMBRO
                </p>
                <h3 className="text-xl font-black text-[#333333] mt-1">
                  Nivel {tierName}
                </h3>
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  {tierName === "Diamante"
                    ? "Acceso a embarque prioritario, Suite Class VIP y 20% adicional de puntos."
                    : tierName === "Platino"
                      ? "Disfrutas de embarque prioritario y 10% adicional de puntos por tramo."
                      : tierName === "Oro"
                        ? "Disfrutas de un 5% adicional de puntos por tramo de viaje."
                        : "Comienza a acumular puntos para subir de nivel."}
                </p>
              </div>
            </div>

            {/* Catalog of rewards: Canjear Puntos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h2 className="text-lg font-black text-[#333333]">
                  Canjear Puntos
                </h2>
                <span className="text-xs font-bold text-amber-700 hover:underline cursor-pointer">
                  Ver Todo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Reward 1 */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className="h-40 bg-gray-100 relative bg-[url('/bus-reward.jpg')] bg-cover bg-center">
                    <span className="absolute top-4 left-4 bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">
                      800 PTS
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-extrabold text-[#333333] text-sm">
                        15% Descuento
                      </h4>
                      <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                        Aplica en tu próximo viaje a cualquier destino nacional.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        redeemPointsMutation.mutate({
                          rewardId: "desc15",
                          points: 8,
                        })
                      }
                      disabled={
                        currentPoints < 800 || redeemPointsMutation.isPending
                      }
                      className="w-full py-3 bg-[#5D4037] hover:bg-[#4E342E] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                    >
                      Canjear
                    </button>
                  </div>
                </div>

                {/* Reward 2 */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className="h-40 bg-gray-100 relative bg-[url('/seat-reward.jpg')] bg-cover bg-center">
                    <span className="absolute top-4 left-4 bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">
                      1200 PTS
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-extrabold text-[#333333] text-sm">
                        Upgrade a Suite Class
                      </h4>
                      <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                        Experimenta el máximo confort con asientos 180° y
                        atención VIP.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        redeemPointsMutation.mutate({
                          rewardId: "upgrade_suite",
                          points: 12,
                        })
                      }
                      disabled={
                        currentPoints < 1200 || redeemPointsMutation.isPending
                      }
                      className="w-full py-3 bg-[#5D4037] hover:bg-[#4E342E] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                    >
                      Canjear
                    </button>
                  </div>
                </div>

                {/* Reward 3 */}
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className="h-40 bg-gray-100 relative bg-[url('/food-reward.jpg')] bg-cover bg-center">
                    <span className="absolute top-4 left-4 bg-amber-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-full">
                      600 PTS
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-extrabold text-[#333333] text-sm">
                        Desayuno a bordo gratis
                      </h4>
                      <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                        Menú premium preparado por chefs para iniciar tu viaje
                        con energía.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        redeemPointsMutation.mutate({
                          rewardId: "desayuno_bordo",
                          points: 6,
                        })
                      }
                      disabled={
                        currentPoints < 600 || redeemPointsMutation.isPending
                      }
                      className="w-full py-3 bg-[#5D4037] hover:bg-[#4E342E] disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent activity list */}
            <div className="space-y-4">
              <h2 className="text-lg font-black text-[#333333] border-b border-gray-100 pb-2">
                Actividad Reciente
              </h2>

              {isLoadPoints ? (
                <div className="py-6 flex justify-center">
                  <div className="size-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : !pointsData?.body?.movements ||
                pointsData.body.movements.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400 font-medium bg-gray-50 rounded-2xl">
                  Aún no registras movimientos de puntos.
                </div>
              ) : (
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-sm text-[#333333]">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-[#5D4037] tracking-wider">
                      <tr>
                        <th className="px-5 py-4">Detalle de Actividad</th>
                        <th className="px-5 py-4">Fecha</th>
                        <th className="px-5 py-4 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pointsData.body.movements.map((mov) => {
                        const isAdd = mov.type === "ADDITION";
                        const pointsVal = mov.points * 100;
                        const formattedDate = format(
                          new Date(mov.createdAt),
                          "dd MMM, yyyy",
                          { locale: es },
                        );

                        let detail = "Bono de Puntos";
                        if (mov.pointsFrom === "SALE") {
                          detail = "Viaje Acumulado";
                        } else if (mov.pointsFrom === "REWARD") {
                          if (mov.points === 8) detail = "Canje Descuento 15%";
                          else if (mov.points === 12)
                            detail = "Canje Upgrade Suite Class";
                          else if (mov.points === 6)
                            detail = "Canje Desayuno a bordo";
                          else detail = "Canje Recompensa";
                        }

                        return (
                          <tr
                            key={mov.pointsUserId}
                            className="hover:bg-gray-50/50"
                          >
                            <td className="px-5 py-4 font-bold flex items-center gap-3">
                              <div
                                className={`size-8 rounded-full flex items-center justify-center text-sm ${
                                  isAdd
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {isAdd ? <LuPlus /> : <LuClock />}
                              </div>
                              {detail}
                            </td>
                            <td className="px-5 py-4 font-medium text-gray-500">
                              {formattedDate}
                            </td>
                            <td
                              className={`px-5 py-4 font-black text-right ${
                                isAdd ? "text-emerald-600" : "text-red-500"
                              }`}
                            >
                              {isAdd ? `+${pointsVal}` : `-${pointsVal}`} pts
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Settings (Configuracion) */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#333333]">
                Configuración de Cuenta
              </h1>
              <p className="text-sm text-[#8B7E74] mt-1">
                Administra los ajustes de seguridad y preferencias de
                notificaciones de tu cuenta.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    Notificaciones de Viajes
                  </p>
                  <p className="text-xs text-gray-400">
                    Recibe alertas del estado de tu bus y alertas de embarque.
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-amber-700"
                />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    Alertas de Puntos y Canjes
                  </p>
                  <p className="text-xs text-gray-400">
                    Recibe correos con tus recompensas y bonos especiales.
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-amber-700"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    Cambiar Contraseña
                  </p>
                  <p className="text-xs text-gray-400">
                    Actualiza tus credenciales de inicio de sesión.
                  </p>
                </div>
                <button
                  onClick={() =>
                    toast.info("Funcionalidad disponible próximamente")
                  }
                  className="px-4 py-2 border border-gray-200 hover:bg-white bg-gray-100 text-[#333333] font-bold rounded-lg text-xs"
                >
                  Modificar
                </button>
              </div>
            </div>

            {/* Travel Interests (RF-04) */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4 mt-6">
              <h3 className="text-base font-black text-gray-800 border-b border-gray-50 pb-2">
                Intereses de Viaje y Ofertas Personalizadas
              </h3>
              <p className="text-xs text-[#8B7E74]">
                Registra tus rutas de interés y las fechas en las que tienes planeado viajar. El sistema generará y te enviará cupones de descuento especiales para estos destinos.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Origen</label>
                  <select
                    value={interestOriginId}
                    onChange={(e) => setInterestOriginId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="">Selecciona origen</option>
                    {destinationsList.map((d) => (
                      <option key={d.destinationId} value={d.destinationId}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Destino</label>
                  <select
                    value={interestDestinationId}
                    onChange={(e) => setInterestDestinationId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="">Selecciona destino</option>
                    {destinationsList.map((d) => (
                      <option key={d.destinationId} value={d.destinationId}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Fecha de viaje</label>
                  <input
                    type="date"
                    value={interestTravelDate}
                    onChange={(e) => setInterestTravelDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (!interestOriginId || !interestDestinationId || !interestTravelDate) {
                      toast.error("Por favor completa todos los campos de preferencia.");
                      return;
                    }
                    saveInterestMutation.mutate({
                      originId: parseInt(interestOriginId),
                      destinationId: parseInt(interestDestinationId),
                      travelDate: interestTravelDate,
                    });
                  }}
                  disabled={saveInterestMutation.isPending}
                  className="px-5 py-2.5 bg-[#5D4037] hover:bg-[#4E342E] text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50"
                >
                  Guardar Preferencias
                </button>
              </div>
            </div>

            {/* WhatsApp Simulation Form */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4 mt-6">
              <h3 className="text-base font-black text-gray-800 border-b border-gray-50 pb-2">
                Prueba de Canal: Enviar Alerta por WhatsApp
              </h3>
              <p className="text-xs text-[#8B7E74]">
                Envía una alerta de promoción simulada a tu teléfono (o número registrado) usando el servicio de IA.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Número de Teléfono</label>
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="Escribe tu celular"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Destino de la Alerta</label>
                  <select
                    value={whatsappDestination}
                    onChange={(e) => setWhatsappDestination(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="">Selecciona un destino</option>
                    {destinationsList.map((d) => (
                      <option key={d.destinationId} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (!whatsappPhone || !whatsappDestination) {
                      toast.error("Ingresa tu teléfono y selecciona el destino para simular.");
                      return;
                    }
                    simulateWhatsAppMutation.mutate({
                      phone: whatsappPhone,
                      destinationName: whatsappDestination,
                    });
                  }}
                  disabled={simulateWhatsAppMutation.isPending}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50"
                >
                  Enviar Alerta WhatsApp
                </button>
              </div>
            </div>

            {/* Notification Alerts Logs */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-4 mt-6">
              <h3 className="text-base font-black text-gray-800 border-b border-gray-50 pb-2">
                Bandeja de Entrada de Alertas
              </h3>
              {alertsList.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No has recibido alertas o cupones todavía.</p>
              ) : (
                <div className="space-y-3">
                  {alertsList.map((alert: any) => (
                    <div key={alert.alertId} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-extrabold text-xs text-gray-800">{alert.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{alert.message}</p>
                        <span className="text-[9px] text-gray-400 font-medium mt-2 block">
                          Recibido: {new Date(alert.sentAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 text-center shrink-0">
                        <span className="text-[10px] font-black text-amber-800 block">{alert.discount}</span>
                        <span className="text-xs font-black text-[#5D4037] block mt-1 font-mono tracking-wider select-all">{alert.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Mis Cupones */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#333333]">
                Mis Cupones y Descuentos
              </h1>
              <p className="text-sm text-[#8B7E74] mt-1">
                Utiliza estos códigos al finalizar tu compra para disfrutar de
                beneficios exclusivos.
              </p>
            </div>

            {isLoadPromos ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="size-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                <p className="text-sm text-[#8B7E74]">
                  Buscando cupones disponibles...
                </p>
              </div>
            ) : !promosResponse?.body || promosResponse.body.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <LuTag className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="font-bold text-gray-700">
                  No hay cupones disponibles
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  En este momento no tienes cupones de descuento activos. ¡Viaja
                  más seguido para desbloquear promociones!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {promosResponse.body.map((promo) => {
                  const discountLabel =
                    promo.discountMode === "PORCENTAJE"
                      ? `${promo.discountValue}% DCTO.`
                      : `S/ ${promo.discountValue} DCTO.`;

                  const expiresDate = format(
                    new Date(promo.expiresAt),
                    "dd MMM yyyy",
                    { locale: es },
                  );

                  return (
                    <div
                      key={promo.promoId}
                      className="bg-linear-to-br from-amber-50/50 to-[#fffbf7] border border-amber-100 rounded-3xl p-6 shadow-xs flex justify-between gap-4 relative overflow-hidden"
                    >
                      {/* Ticket cut-outs visual style decoration */}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-3 size-6 rounded-full bg-white border-r border-amber-100"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 -right-3 size-6 rounded-full bg-white border-l border-amber-100"></div>

                      <div className="space-y-3 pl-2 flex-1">
                        <span className="px-2.5 py-1 bg-amber-700/10 text-amber-800 text-[10px] font-black uppercase rounded-full tracking-wider">
                          {discountLabel}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-[#333333] text-base">
                            {promo.name}
                          </h3>
                          <p className="text-xs text-[#8B7E74] font-medium mt-1">
                            {promo.description ||
                              "Descuento en tu pasaje nacional."}
                          </p>
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold space-y-0.5">
                          <p>Monto mínimo: S/ {promo.minimumPurchaseAmount}</p>
                          <p>Vence el {expiresDate}</p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-center gap-2 pr-2 border-l border-dashed border-amber-200/50 pl-6 min-w-[110px]">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                          CÓDIGO
                        </span>
                        <span className="px-3 py-1.5 bg-[#5D4037] text-white text-xs font-black tracking-wider uppercase rounded-xl select-all select-none">
                          {promo.code}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(promo.code);
                            toast.success("¡Código copiado al portapapeles!");
                          }}
                          className="text-[9px] font-black text-amber-700 hover:underline cursor-pointer"
                        >
                          COPIAR CÓDIGO
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Recomendaciones */}
        {activeTab === "recommendations" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#333333]">
                Recomendaciones para Ti
              </h1>
              <p className="text-sm text-[#8B7E74] mt-1">
                Destinos sugeridos especialmente para tus próximos viajes.
              </p>
            </div>

            {recommendationsIsLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="size-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                <p className="text-sm text-[#8B7E74]">
                  Buscando recomendaciones personalizadas...
                </p>
              </div>
            ) : !recommendationsResponse?.body || recommendationsResponse.body.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                <LuCompass className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="font-bold text-gray-700">
                  Sin recomendaciones por el momento
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Sigue viajando con Entrafesa para que podamos conocer tus destinos favoritos y ofrecerte mejores sugerencias.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendationsResponse.body.map((dest) => (
                  <div
                    key={dest.destinationId}
                    className="bg-linear-to-br from-amber-50/20 to-[#fffbf7] border border-gray-200 hover:border-amber-300 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-56 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="space-y-3">
                      <div className="size-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-100 group-hover:scale-110 transition-transform">
                        <LuMapPin className="text-lg" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#333333] text-base">
                          {dest.name}
                        </h3>
                        <p className="text-xs text-[#8B7E74] font-medium mt-1 line-clamp-3">
                          {dest.shortDescription || "Explora este increíble destino nacional con la comodidad e Imperial Class de Entrafesa."}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/?destination=${dest.slug}`)}
                      className="w-full py-2.5 bg-[#5D4037] hover:bg-[#4E342E] text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      Buscar Viajes
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {reviewTicket && (
        <ReviewModal
          ticket={reviewTicket}
          onClose={() => {
            setReviewTicket(null);
            setHasDeclinedReviewThisSession(true);
          }}
          onSubmitSuccess={() => {
            setReviewTicket(null);
            refetchPendingReviews();
          }}
        />
      )}

      {paymentModalTicket && (
        <PaymentGatewayModal
          ticket={paymentModalTicket}
          onClose={() => setPaymentModalTicket(null)}
          onConfirm={() => {
            approveTicketMutation.mutate(paymentModalTicket.saleId);
            setPaymentModalTicket(null);
          }}
          isProcessing={approveTicketMutation.isPending}
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-[#fdfcfb]">
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 rounded-full border-4 border-amber-700 border-t-transparent animate-spin"></div>
            <p className="text-[#5D4037] font-semibold">Cargando perfil...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </React.Suspense>
  );
}
