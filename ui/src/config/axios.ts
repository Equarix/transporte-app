import axios from "axios";
import { ENV } from "./ENV";

export const instance = axios.create({
  baseURL: ENV.API_URL,
});
