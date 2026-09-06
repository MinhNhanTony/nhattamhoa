const mongoose = require('mongoose');

async function connect() {
  const DB_URL = process.env.MONGODB_CONECT || 'mongodb://localhost:27017/qananolan_dev';
  try {
    await mongoose.connect(DB_URL);
    
    console.log('Connect successfully');
  } catch (error) {
    console.log('Connect failure',error);
  }
}
module.exports = { connect };
