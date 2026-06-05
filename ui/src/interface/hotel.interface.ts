export interface ResposeHotelCercano {
  data: Daum[];
  meta: Meta;
}

export interface Daum {
  hotelId: number;
  name: string;
  location: string;
  price_per_night: number;
  nights: number;
  persons: number;
  ranking: string;
  lat: string;
  lng: string;
  image_name: string;
  url_image: string;
  url_map: string;
  tax_info: string;
  Distance: number;
  checkIn?: string;
  checkOut?: string;
}

export interface Meta {
  lat: number;
  lng: number;
  distanceMeters: number;
  total: number;
}
