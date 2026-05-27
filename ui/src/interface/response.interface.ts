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
  galery: Galery;
  services: Service[];
  reservers: Reservers[];
  slug: string;
}

export interface Reservers {
  reserverId: number;
  date: string;
  registerAt: string;
  status: string;
  reserverPriceFloors: ReserverPriceFloor[];
  driver: Driver;
  reserverAgencies: ReserverAgency[];
  bus: Bus;
  checkOut: Destination;
}

export interface Destination {
  destinationId: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  lat: string;
  lng: string;
  status: boolean;
}

export interface ReserverPriceFloor {
  reserverPriceFloorId: number;
  price: number;
}

export interface Driver {
  userId: number;
  typeDocument: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  typeUser: string;
  isActive: boolean;
}

export interface ReserverAgency {
  reserverAgencyId: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  hour: string;
  agency: ReserverAgency;
}

export interface Bus {
  busId: number;
  type: string;
  name: string;
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
  columns: number;
  rows: number;
  status: boolean;
  seats: Seat[];
}

export interface Seat {
  seatId: number;
  name: string;
  typeSeat: string;
  status: boolean;
  row: number;
  column: number;
  reserver: string;
}

export interface Galery {
  imageId: number;
  imageUrl: string;
  createdAt: string;
  imageName: string;
}

export interface Service {
  agencyServiceId: number;
  icon: string;
  name: string;
}

export interface Reserver {
  reserverId: number;
  date: string;
  registerAt: string;
  status: string;
  checkOutHour: string;
  reserverAgencies: ReserverAgency[];
}

export interface ReserverAgency {
  reserverAgencyId: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  hour: string;
}

export interface ResponseBooking {
  origin: Destination;
  destination: Destination;
  reservations: Reserver[];
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
  typeUser: string;
  isActive: boolean;
}

export interface ResponseMapa {
  reserverId: number;
  date: string;
  registerAt: string;
  status: string;
  checkOutHour: string;
  checkIn: CheckIn;
  checkOut: CheckOut;
}

export interface CheckIn {
  destinationId: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  lat: string;
  lng: string;
  status: boolean;
}

export interface CheckOut {
  destinationId: number;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  lat: string;
  lng: string;
  status: boolean;
}
