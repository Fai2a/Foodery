const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

// @POST /api/reservation
router.post("/", async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).json({ message: "Reservation successful!", reservation: newReservation });
  } catch (error) {
    res.status(500).json({ message: "Error saving reservation", error });
  }
});

module.exports = router;
