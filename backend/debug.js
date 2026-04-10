const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/User');

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check all users
    const users = await User.find().select('+password');
    console.log('📊 USERS IN DATABASE:');
    console.log(`Total users: ${users.length}\n`);
    
    users.forEach((u, i) => {
      console.log(`${i + 1}. Email: ${u.email}`);
      console.log(`   Name: ${u.name}`);
      console.log(`   Role: ${u.role}`);
      console.log(`   Password Hash: ${u.password.substring(0, 20)}...`);
      console.log('');
    });

    // Test password comparison
    console.log('🔐 PASSWORD TEST:');
    const adminUser = await User.findOne({ email: 'admin@luxuryhotel.com' }).select('+password');
    
    if (adminUser) {
      const passwordToTest = 'admin123';
      const isMatch = await adminUser.comparePassword(passwordToTest);
      console.log(`Admin user found: ${adminUser.name}`);
      console.log(`Testing password: "${passwordToTest}"`);
      console.log(`Password match: ${isMatch ? '✅ YES' : '❌ NO'}\n`);
      
      if (!isMatch) {
        console.log('⚠️  Password mismatch! Expected password from .env: admin123');
        console.log('Try resetting the password by running seeder.js again\n');
      }
    } else {
      console.log('❌ Admin user NOT FOUND in database!');
      console.log('Run: node seeder.js\n');
    }

    // Check room count
    const Room = require('./models/Room');
    const roomCount = await Room.countDocuments();
    console.log(`📍 Rooms in database: ${roomCount}`);
    
    if (roomCount === 0) {
      console.log('⚠️  No rooms found. Run: node seeder.js\n');
    } else {
      console.log('✅ Rooms seeded\n');
    }

    console.log('========================================');
    console.log('❓ TROUBLESHOOTING:');
    console.log('========================================');
    console.log('If users missing → Run: node seeder.js');
    console.log('If password fails → Run: node seeder.js (to rehash)');
    console.log('If still failing → Clear DB and reseed:');
    console.log('  1. Delete hotel_booking database in MongoDB');
    console.log('  2. Run: node seeder.js');
    console.log('  3. Restart backend and frontend');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

debug();
