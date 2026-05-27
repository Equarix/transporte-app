import axios from "axios";

const hotel = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOTEL,
});

export default hotel;
