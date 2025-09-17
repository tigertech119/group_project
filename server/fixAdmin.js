
/*
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

*/



// server/fixAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI + '/' + process.env.DB_NAME);
    const Doctor = require('./models/Doctor');

    await Doctor.updateOne(
      { email: "dummydoc8@gmail.com" },
      { 
        $set: { isVerified: true },     // ✅ mark verified
        $unset: { 
          applicationStatus: "", 
          appliedFor: "", 
          verificationCode: ""          // ✅ remove any leftover code
        } 
      }
    );

    console.log('✅ Dummy doctor fixed: verified=true, extra fields removed.');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing admin:', err);
    process.exit(1);
  }
}

fixAdmin();
