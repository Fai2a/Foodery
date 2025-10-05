// src/config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in env');

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // mongoose v7 defaults are fine; options included for clarity
  });
  console.log('✅ MongoDB connected');
}

module.exports = connectDB;
