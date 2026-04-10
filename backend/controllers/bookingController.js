const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, paymentMethod, specialRequests } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.isAvailable) return res.status(400).json({ message: 'Room not available' });

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.price;

    const status = paymentMethod === 'pay_at_hotel' ? 'pending' : 'confirmed';
    const paymentStatus = paymentMethod === 'pay_at_hotel' ? 'unpaid' : 'paid';

    const booking = await Booking.create({
      user: req.user._id, room: roomId,
      checkIn, checkOut, guests, totalPrice, paymentMethod, specialRequests,
      status, paymentStatus
    });

    room.isAvailable = false;
    await room.save();

    await booking.populate([{ path: 'user' }, { path: 'room' }]);
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room').sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'name price type')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: { $ne: 'cancelled' } },
      { status: 'cancelled' }, { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found or already cancelled' });
    
    // Make room available again
    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });

    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};