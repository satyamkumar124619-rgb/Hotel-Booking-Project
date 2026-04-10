import API from './config';

export const registerUser = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  if (data.token) localStorage.setItem('token', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  if (data.token) localStorage.setItem('token', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem('token');