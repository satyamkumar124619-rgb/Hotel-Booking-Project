const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('✅ MongoDB Connected');

  const db = mongoose.connection.db;

  await db.collection('users').deleteMany({});
  await db.collection('rooms').deleteMany({});
  await db.collection('bookings').deleteMany({});
  console.log('🗑️  Old data cleared');

  // Users
  await db.collection('users').insertMany([
    { name: 'Admin User', email: 'admin@luxuryhotel.com', password: await bcrypt.hash('admin123', 10), phone: '9876543210', role: 'admin', createdAt: new Date() },
    { name: 'John Doe', email: 'john@example.com', password: await bcrypt.hash('john1234', 10), phone: '9876501234', role: 'user', createdAt: new Date() },
  ]);
  console.log('👤 Users created');

  // Rooms
  await db.collection('rooms').insertMany([
    { name: 'Classic Standard Room', roomType: 'standard', price: 2999, description: 'Cozy and comfortable room for solo travelers or couples.', amenities: ['Free WiFi', 'AC', 'TV', 'Mini Bar', 'Room Service'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], capacity: 2, size: '280 sq ft', isAvailable: true, featured: false, rating: 4.2, createdAt: new Date() },
    { name: 'Deluxe King Room', roomType: 'deluxe', price: 5999, description: 'Spacious room with king-size bed and stunning city views.', amenities: ['Free WiFi', 'AC', 'Smart TV', 'Mini Bar', 'Bathtub', 'Balcony'], images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'], capacity: 2, size: '420 sq ft', isAvailable: true, featured: true, rating: 4.5, createdAt: new Date() },
    { name: 'Premium Suite', roomType: 'suite', price: 9999, description: 'Premium suite with separate living area and breathtaking views.', amenities: ['Free WiFi', 'AC', 'Smart TV', 'Jacuzzi', 'Butler Service', 'Balcony'], images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'], capacity: 3, size: '750 sq ft', isAvailable: true, featured: true, rating: 4.8, createdAt: new Date() },
    { name: 'Presidential Suite', roomType: 'presidential', price: 19999, description: 'Ultimate luxury with private pool and personal butler.', amenities: ['Free WiFi', 'AC', 'Home Theater', 'Private Pool', 'Jacuzzi', 'Kitchen'], images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'], capacity: 4, size: '2000 sq ft', isAvailable: true, featured: true, rating: 5.0, createdAt: new Date() },
    { name: 'Twin Deluxe Room', roomType: 'deluxe', price: 4999, description: 'Perfect for friends with two comfortable twin beds.', amenities: ['Free WiFi', 'AC', 'Smart TV', 'Mini Bar', 'Room Service'], images: ['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800'], capacity: 2, size: '380 sq ft', isAvailable: true, featured: false, rating: 4.3, createdAt: new Date() },
    { name: 'Family Suite', roomType: 'suite', price: 12999, description: 'Spacious family suite with two bedrooms and kids area.', amenities: ['Free WiFi', 'AC', 'Smart TV', 'Kitchenette', 'Kids Area', 'Extra Beds'], images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'], capacity: 5, size: '1200 sq ft', isAvailable: true, featured: true, rating: 4.7, createdAt: new Date() },
  ]);
  console.log('🛏️  Rooms created');

  // Bookings
  const john = await db.collection('users').findOne({ email: 'john@example.com' });
  const admin = await db.collection('users').findOne({ email: 'admin@luxuryhotel.com' });
  const allRooms = await db.collection('rooms').find().toArray();

  if (john && allRooms.length > 2) {
    await db.collection('bookings').insertMany([
      {
        user: john._id,
        room: allRooms[0]._id,
        checkIn: new Date(Date.now() + 86400000 * 2), // 2 days from now
        checkOut: new Date(Date.now() + 86400000 * 5),
        guests: 2,
        totalPrice: allRooms[0].price * 3,
        status: 'confirmed',
        paymentMethod: 'Credit Card',
        paymentStatus: 'completed',
        specialRequests: 'High floor if possible',
        createdAt: new Date()
      },
      {
        user: admin._id,
        room: allRooms[1]._id,
        checkIn: new Date(Date.now() + 86400000 * 10), // 10 days from now
        checkOut: new Date(Date.now() + 86400000 * 12),
        guests: 1,
        totalPrice: allRooms[1].price * 2,
        status: 'pending',
        paymentMethod: 'PayPal',
        paymentStatus: 'unpaid',
        specialRequests: 'None',
        createdAt: new Date()
      },
      {
        user: john._id,
        room: allRooms[2]._id,
        checkIn: new Date(Date.now() - 86400000 * 5), // 5 days ago
        checkOut: new Date(Date.now() - 86400000 * 2), // 2 days ago
        guests: 2,
        totalPrice: allRooms[2].price * 3,
        status: 'confirmed', // Assuming past bookings stick with 'confirmed' or 'completed'
        paymentMethod: 'Debit Card',
        paymentStatus: 'completed',
        specialRequests: 'Extra towels',
        createdAt: new Date(Date.now() - 86400000 * 10)
      }
    ]);
    console.log('📅 Bookings created');
  }

  console.log('========================================');
  console.log('✅ DONE!');
  console.log('Admin → admin@luxuryhotel.com / admin123');
  console.log('User  → john@example.com / john1234');
  console.log('========================================');
  process.exit(0);

}).catch(e => {
  console.log('❌ Error:', e.message);
  process.exit(1);
});