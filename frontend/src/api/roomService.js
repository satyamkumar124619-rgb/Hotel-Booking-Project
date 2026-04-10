import API from './config';

export const getAllRooms = async (filters = {}) => {
  const { data } = await API.get('/rooms', { params: filters });
  return data;
};

export const getRoomById = async (id) => {
  const { data } = await API.get(`/rooms/${id}`);
  return data;
};

export const createRoom = async (roomData) => {
  const { data } = await API.post('/rooms', roomData);
  return data;
};

export const updateRoom = async (id, roomData) => {
  const { data } = await API.put(`/rooms/${id}`, roomData);
  return data;
};

export const deleteRoom = async (id) => {
  const { data } = await API.delete(`/rooms/${id}`);
  return data;
};