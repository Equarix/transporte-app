import { Daum as Hotel } from "@/interface/hotel.interface";

export interface Clients {
  documentType: string;
  documentNumber: string;
  names: string;
  lastName: string;
  motherLastName: string;
  gender: string;
  birthDate: string;
}

export interface ClientPay extends Clients {
  email: string;
  phone: string;
}

export interface PaymentMethod {
  provider: string; // "MERCADOPAGO", "YAPE", "PLIN", "BCP", "INTERBANK", "PAGOEFECTIVO"
  type: "CREDIT_CARD" | "DIGITAL_WALLET" | "CASH";
}

export interface BookingPassenger extends Clients {
  floor: number;
  price: number;
}

export interface BookingPayload {
  reserverId: number;
  payer: Clients;
  paymentMethod: PaymentMethod;
  passengers: BookingPassenger[];
  hotel?: Hotel | null;
  busId: number;
  fromDestinationId: number;
  toDestinationId: number;
  promoCode?: string;
}
