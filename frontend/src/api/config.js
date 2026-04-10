import axios from 'axios';
import storage from './storageManager';

const API = axios.create({
  baseURL: 'https://hotel-booking-project-uo5r.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = storage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;