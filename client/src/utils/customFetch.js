import axios from "axios";
import Cookies from "js-cookie";

const customFetch = axios.create({
  baseURL: "https://e-commerce-1-a403.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" },
});
customFetch.interceptors.request.use((config) => {
  const authToken = Cookies.get("jwt");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
export default customFetch;
