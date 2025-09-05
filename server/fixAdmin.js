// Create fixAdmin.js in your server folder and run: node fixAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI + '/' + process.env.DB_NAME);
    const User = require('./models/User');
    
    await User.updateOne(
      { email: "admin@hospital.com" },
      { $unset: { applicationStatus: "", appliedFor: "" } }
    );
    
    console.log('✅ Admin user fixed! Removed applicationStatus and appliedFor fields.');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing admin:', err);
    process.exit(1);
  }
}

fixAdmin();