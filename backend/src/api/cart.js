import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

// 🧾 Add item to cart
router.post("/", async (req, res) => {
  try {
    const { userId, menuId, quantity } = req.body;
    if (!userId || !menuId) {
      return res.status(400).json({ error: "userId and menuId are required." });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.menuId.toString() === menuId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ menuId, quantity: quantity || 1 });
    }

    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error("Add item error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📦 Get user's cart
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.menuId");
    res.json(cart || { items: [] });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🗑️ Delete a specific item
router.delete("/:userId/:menuId", async (req, res) => {
  try {
    const { userId, menuId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.menuId.toString() !== menuId.toString()
    );

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
