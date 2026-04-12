export interface ApiResponse<T> {
  message: string;
  body: T;
  status: number;
  token?: string;
  errors?: string[];
  metadata?: {
    totalItems: number;
    itemCount: number;
    totalPages: number;
    currentPage: number;
  };
}
export interface AuthResponse {
  userId: number;
  password: string;
  typeDocument: string;
  documentNumber: string;
  role: string;
  profile: Profile;
  token: string;
}

export interface Profile {
  userId: number;
  typeDocument: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface ResponseGalery {
  imageId: number;
  imageUrl: string;
  createdAt: string;
  imageName: string;
}

export interface ResponseDestination {
  destinationId: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  lat: string;
  lng: string;
  status: boolean;
  experiences: Experience[];
  galery: ResponseGalery;
}

export interface Experience {
  experienceId: number;
  type: string;
  name: string;
  description: string;
  lat: string;
  lng: string;
  galery: ResponseGalery;
}

export interface ResponseAgency {
  agencyId: number;
  name: string;
  largeAddress: string;
  address: string;
  phone: string;
  description: string;
  status: boolean;
  lat: string;
  lng: string;
  galery: ResponseGalery;
}

export interface ResponseBus {
  busId: number;
  plate: string;
  model: string;
  year: number;
  capacity: number;
  status: boolean;
  floors: Floor[];
}

export interface Floor {
  floorId: number;
  name: string;
  order: number;
  status: boolean;
  columns: number;
  rows: number;
  columnFloors: ColumnFloor[];
}

export interface ColumnFloor {
  columnFloorId: number;
  position: string;
  status: boolean;
  seats: Seat[];
}

export interface Seat {
  seatId: number;
  name: string;
  typeSeat: string;
  status: boolean;
  row: number;
}
