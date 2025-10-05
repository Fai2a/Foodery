import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

  items: [
    {
      menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
      name: { type: String },       // ✅ store name for history
      price: { type: Number },      // ✅ store price snapshot
      quantity: { type: Number, default: 1 }
    }
  ],

  totalAmount: { type: Number, required: true }, // ✅ store total order cost
  status: { type: String, default: "Pending (Cash on Delivery)" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
