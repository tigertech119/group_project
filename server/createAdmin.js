/*const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI + '/' + process.env.DB_NAME);
    console.log('✅ Connected to MongoDB');

    // Get User model
    const User = require('./models/User');
    
    // Hash password
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    await User.create({
      email: 'admin@hospital.com',
      passwordHash: passwordHash,
      role: 'admin',
      profile: {
        fullName: 'System Administrator',
        phone: '123-ADMIN-456'
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@hospital.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();


*/


// server/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI + '/' + process.env.DB_NAME);
    console.log('✅ Connected to MongoDB');

    const Doctor = require('./models/Doctor');

    const passwordHash = await bcrypt.hash('12345678', 10);

    await Doctor.create({
      email: ' doctor8@gmail.com',
      passwordHash,
      role: 'doctor',
      isVerified: true,                 // ✅ allow login without OTP
      profile: {
        fullName: 'Dr Ahbab Hassan khan   ',
        phone: '0215487697',
        department: 'Pediatrics'
      }
    });

    console.log('✅ Doctor user created successfully!');
    console.log('Email: dummydoc4@gmail.com');
    console.log('Password: 12345678');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();
