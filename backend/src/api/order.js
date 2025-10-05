// backend/src/api/orders.js
import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// ✅ Create new order (Cash on Delivery)
router.post("/", async (req, res) => {
  try {
    const { userId, name, phone, address, items } = req.body;

    if (!userId || !name || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required fields or empty cart." });
    }

    const newOrder = new Order({
      userId,
      name,
      phone,
      address,
      items,
      status: "Pending (Cash on Delivery)",
      createdAt: new Date(),
    });

    await newOrder.save();

    // ✅ Clear user’s cart after successful order
    await Cart.findOneAndDelete({ userId });

    res.json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all orders (for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menuId");
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
