const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const { roomType, minPrice, maxPrice, available } = req.query;
    let filter = {};
    if (roomType) filter.roomType = roomType;
    if (available) filter.isAvailable = available === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ success: true, message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};