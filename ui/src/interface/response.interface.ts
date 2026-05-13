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
  plate: string;
  model: string;
  year: number;
  capacity: number;
  status: boolean;
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
