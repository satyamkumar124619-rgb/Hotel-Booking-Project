import API from './config';

export const createBooking = async (bookingData) => {
  const { data } = await API.post('/bookings', bookingData);
  return data;
};

export const getMyBookings = async () => {
  const { data } = await API.get('/bookings/my');
  return data;
};

export const cancelBooking = async (id) => {
  const { data } = await API.put(`/bookings/${id}/cancel`);
  return data;
};

export const getAllBookings = async () => {
  const { data } = await API.get('/bookings/all');
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data } = await API.put(`/bookings/${id}/status`, { status });
  return data;
};