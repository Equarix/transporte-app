import { ENV } from "@/config/env";
import axios from "axios";

export const instance = axios.create({
  baseURL: ENV.API_URL,
});
