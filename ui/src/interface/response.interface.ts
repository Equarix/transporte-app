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
}

export interface Galery {
  imageId: number;
  imageUrl: string;
  createdAt: string;
  imageName: string;
}
