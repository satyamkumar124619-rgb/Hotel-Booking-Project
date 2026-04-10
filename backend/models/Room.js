const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomType: { 
    type: String, 
    required: true 
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  amenities: [String],
  images: [String],
  capacity: { type: Number, default: 2 },
  size: { type: String },
  isAvailable: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Room', roomSchema);