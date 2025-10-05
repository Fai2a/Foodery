// backend/src/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
      quantity: { type: Number, default: 1 },
    },
  ],
  status: { type: String, default: "Pending (Cash on Delivery)" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
