// src/models/Reservation.js
// const mongoose = require('mongoose');

// const reservationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String },
//   date: { type: Date, required: true },
//   time: { type: String, required: true }, // store as string e.g. "19:30"
//   guests: { type: Number, required: true, min: 1 },
//   status: { type: String, enum: ['Pending','Confirmed','Cancelled'], default: 'Pending' },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Reservation', reservationSchema);

const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
