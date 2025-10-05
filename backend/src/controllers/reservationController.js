const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
  try {
    const data = req.body;
    const reservation = new Reservation(data);
    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const list = await Reservation.find().sort({ date: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
