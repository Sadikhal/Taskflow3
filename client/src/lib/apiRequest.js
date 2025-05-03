import axios from "axios";

// Fetch BASE_URL from .env
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
