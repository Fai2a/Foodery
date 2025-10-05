// backend/src/api/cart.js
import express from "express";
import Cart from "../models/Cart.js";
import mongoose from "mongoose";

const router = express.Router();

// GET cart for a user (populated)
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.menuId");
    return res.json(cart || { items: [] });
  } catch (err) {
    console.error("Error GET /api/cart/:userId", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST add item to cart -> body: { menuId, quantity? }
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { menuId, quantity = 1 } = req.body;

    if (!menuId || !mongoose.Types.ObjectId.isValid(menuId)) {
      return res.status(400).json({ success: false, message: "Invalid menuId" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existing = cart.items.find(i => i.menuId.toString() === menuId);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({ menuId, quantity: Number(quantity) });
    }

    await cart.save();
    await cart.populate("items.menuId").execPopulate?.() || await cart.populate("items.menuId");
    return res.json({ success: true, cart });
  } catch (err) {
    console.error("Error POST /api/cart/:userId", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT update quantity for an item -> body: { menuId, quantity }
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { menuId, quantity } = req.body;

    if (!menuId || typeof quantity !== "number") {
      return res.status(400).json({ success: false, message: "menuId and numeric quantity required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find(i => i.menuId.toString() === menuId);
    if (!item) return res.status(404).json({ success: false, message: "Item not in cart" });

    if (quantity <= 0) {
      // remove item
      cart.items = cart.items.filter(i => i.menuId.toString() !== menuId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.menuId").execPopulate?.() || await cart.populate("items.menuId");
    return res.json({ success: true, cart });
  } catch (err) {
    console.error("Error PUT /api/cart/:userId", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE remove single menuId from cart -> body: { menuId }
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { menuId } = req.body;
    if (!menuId) return res.status(400).json({ success: false, message: "menuId required" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(i => i.menuId.toString() !== menuId);
    await cart.save();
    await cart.populate("items.menuId").execPopulate?.() || await cart.populate("items.menuId");
    return res.json({ success: true, cart });
  } catch (err) {
    console.error("Error DELETE /api/cart/:userId", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
