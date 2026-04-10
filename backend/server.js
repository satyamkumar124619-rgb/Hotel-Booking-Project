const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const authRoutes    = require('./routes/auth');
const roomRoutes    = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const adminRoutes   = require('./routes/admin');

app.use('/api/auth',     authRoutes);
app.use('/api/rooms',    roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin',    adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🏨 Hotel Booking API is running!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});