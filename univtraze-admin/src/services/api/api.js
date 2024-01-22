import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const LOCAL_STORAGE_KEY = 'token';

const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY);

const authInterceptor = (req) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    return req;
};

export const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

API.interceptors.request.use(authInterceptor);
