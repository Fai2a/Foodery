import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const router = express.Router();

/**
 * 🛒 POST /api/orders
 * → Save user order (from checkout form)
 */
router.post("/", async (req, res) => {
  try {
    const { userId, name, phone, address } = req.body;

    // 🔍 Validate required fields
    if (!userId || !name || !phone || !address) {
      return res.status(400).json({ error: "تمام فیلڈز لازمی ہیں۔" });
    }

    // 🛍️ Fetch user cart with populated menu data
    const userCart = await Cart.findOne({ userId }).populate("items.menuId");

    if (!userCart || !userCart.items || userCart.items.length === 0) {
      return res.status(400).json({ error: "آپ کی کارٹ خالی ہے۔" });
    }

    // 🧾 Create new order document
    const newOrder = new Order({
      userId,
      name,
      phone,
      address,
      items: userCart.items.map(item => ({
        menuId: item.menuId._id,
        name: item.menuId.name,
        price: item.menuId.price,
        quantity: item.quantity
      })),
      totalAmount: userCart.items.reduce(
        (sum, item) => sum + item.menuId.price * item.quantity,
        0
      ),
      status: "Pending (Cash on Delivery)",
      createdAt: new Date()
    });

    // 💾 Save order
    await newOrder.save();

    // 🧹 Clear user cart after order placed
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({
      success: true,
      message: "✅ آرڈر کامیابی سے دے دیا گیا!",
      order: newOrder
    });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ error: "سرور میں خرابی۔" });
  }
});

/**
 * 🧾 GET /api/orders/:userId
 * → Get all orders of a user
 */
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.menuId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Order fetch error:", err);
    res.status(500).json({ error: "سرور میں خرابی۔" });
  }
});

export default router;
