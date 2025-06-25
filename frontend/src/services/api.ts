import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // ganti sesuai domain API kamu
  withCredentials: false,
});

api.interceptors.request.use((config:any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
