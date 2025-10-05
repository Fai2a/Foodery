import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname issue in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static folder (images)
app.use("/images", express.static(path.join(__dirname, "public/images")));

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected..."))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ============================
📌 Menu Schema & Routes
============================ */
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, enum: ["burger", "pizza", "pasta", "fries",], required: true },
  description: { type: String, default: "" }
});
const Menu = mongoose.model("Menu", menuSchema);

// GET - Fetch all menu items
app.get("/api/menu", async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (err) {
    console.error("❌ Error fetching menu:", err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// GET - Fetch single menu item by ID
app.get("/api/menu/:id", async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json(menuItem);
  } catch (err) {
    console.error("❌ Error fetching menu item:", err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// POST - Add new menu item
app.post("/api/menu", async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;
    if (!name || !price || !image || !category) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }
    const newItem = new Menu({ name, price, image, category, description });
    await newItem.save();
    res.json({ success: true, message: "Menu item added successfully!" });
  } catch (err) {
    console.error("❌ Error adding menu item:", err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// PUT - Update menu item
app.put("/api/menu/:id", async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, message: "Menu item updated successfully!", data: updatedItem });
  } catch (err) {
    console.error("❌ Error updating menu item:", err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// DELETE - Remove menu item
app.delete("/api/menu/:id", async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, message: "Menu item deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting menu item:", err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

/* ============================
📌 Contact Schema & Routes
============================ */
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});
const Contact = mongoose.model("Contact", contactSchema);

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ success: true, data: contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

/* ============================
📌 Reservation Schema & Routes
============================ */
const reservationSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  time: String,
  guests: Number,
});
const Reservation = mongoose.model("Reservation", reservationSchema);

app.post("/api/reservations", async (req, res) => {
  try {
    const { name, email, date, time, guests } = req.body;
    if (!name || !email || !date || !time || !guests) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }
    const newReservation = new Reservation({ name, email, date, time, guests });
    await newReservation.save();
    res.json({ success: true, message: "Reservation saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json({ success: true, data: reservations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

/* ============================
📌 Cart Routes (Imported)
============================ */
import cartRoutes from "./src/api/cart.js";
app.use("/api/cart", cartRoutes);

/* ============================
📌 Checkout Schema & Routes
============================ */
const checkoutSchema = new mongoose.Schema({
  userId: String,
  name: String,
  phone: String,
  address: String,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalAmount: Number,
  paymentMethod: { type: String, default: "Cash on Delivery" },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Checkout = mongoose.model("Order", checkoutSchema);

// POST - Create new order
app.post("/api/order", async (req, res) => {
  try {
    const { userId, name, phone, address, items, totalAmount } = req.body;

    if (!name || !phone || !address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const newOrder = new Checkout({
      userId,
      name,
      phone,
      address,
      items,
      totalAmount,
      status: "Pending (Cash on Delivery)",
    });

    await newOrder.save();

    res.json({ success: true, message: "✅ Order placed successfully!", data: newOrder });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// GET - Fetch all orders
app.get("/api/order", async (req, res) => {
  try {
    const orders = await Checkout.find();
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
