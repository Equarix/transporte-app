export interface ResponseSaveReserver {
    userId: number;
    purchaseFrom: string;
    reserverId: number;
    salePayer: SalePayer;
    fromDestinationId: number;
    toDestinationId: number;
    agencyId: any;
    saleId: number;
    createdAt: string;
    status: string;
    hotelDetails: HotelDetail[];
    saleDetails: SaleDetail[];
    salesPoints: SalePoints;
}

export interface SalePoints {
    userId: number
    points: number
    pointsFrom: string
    type: string
    pointsUserId: number
    createdAt: string
}

export interface SalePayer {
    userId: number;
    documentType: string;
    documentNumber: string;
    names: string;
    email: string;
    phone: string;
    providerMethod: string;
    typeMethod: string;
    salePayerId: number;
}

export interface Sale {
    userId: number;
    purchaseFrom: string;
    reserverId: number;
    salePayer: SalePayer;
    fromDestinationId: number;
    toDestinationId: number;
    agencyId: any;
    saleId: number;
    createdAt: string;
    status: string;
}

export interface HotelDetail {
    hotelId: number;
    amount: number;
    sale: Sale;
    checkIn: string;
    checkOut: string;
    clientName: string;
    hotelName: string;
    referenceNumber: string;
    roomId: number;
    hotelDetailId: number;
}

export interface SaleDetail {
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
    sale: Sale;
    saleDetailId: number;
}