import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Load environment variables
dotenv.config();

// ✅ Fix __dirname issue for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Menu Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["burger", "pizza", "pasta", "fries"], 
    required: true 
  },
  description: { type: String, default: "" }
});

const Menu = mongoose.model("Menu", menuSchema);

// ✅ Seed Data (only burger, pizza, pasta, fries) — Prices in USD 💲
const seedMenu = [
  // 🍔 Burgers
  {
    name: "Cheese Burger",
    price: 8,
    image: "/images/cheeseburger.jpg",
    category: "burger",
    description: "Juicy beef patty topped with cheddar cheese and lettuce."
  },
  {
    name: "Chicken Zinger Burger",
    price: 9,
    image: "/images/zingerburger.jpg",
    category: "burger",
    description: "Crispy fried chicken with spicy mayo and lettuce."
  },
  {
    name: "Double Beef Burger",
    price: 12,
    image: "/images/doublebeef.jpg",
    category: "burger",
    description: "Two beef patties with melted cheese and BBQ sauce."
  },

  // 🍕 Pizzas
  {
    name: "Margherita Pizza",
    price: 10,
    image: "/images/margherita.jpg",
    category: "pizza",
    description: "Classic cheese pizza with tomato sauce and fresh basil."
  },
  {
    name: "Pepperoni Pizza",
    price: 12,
    image: "/images/pepperoni.jpg",
    category: "pizza",
    description: "Loaded with pepperoni slices and mozzarella cheese."
  },
  {
    name: "BBQ Chicken Pizza",
    price: 13,
    image: "/images/bbqchickenpizza.jpg",
    category: "pizza",
    description: "Grilled chicken, BBQ sauce, and onions on a crispy crust."
  },

  // 🍝 Pastas
  {
    name: "Creamy Alfredo Pasta",
    price: 9,
    image: "/images/alfredo.jpg",
    category: "pasta",
    description: "Rich creamy sauce with grilled chicken and fettuccine."
  },
  {
    name: "Spaghetti Bolognese",
    price: 10,
    image: "/images/bolognese.jpg",
    category: "pasta",
    description: "Classic Italian pasta with slow-cooked beef sauce."
  },
  {
    name: "Penne Arrabiata",
    price: 8,
    image: "/images/arrabiata.jpg",
    category: "pasta",
    description: "Spicy tomato-based pasta with herbs and olive oil."
  },

  // 🍟 Fries
  {
    name: "French Fries",
    price: 4,
    image: "/images/fries.jpg",
    category: "fries",
    description: "Golden crispy fries served with ketchup."
  },
  {
    name: "Curly Fries",
    price: 5,
    image: "/images/curlyfries.jpg",
    category: "fries",
    description: "Spiral-cut fries seasoned with paprika and salt."
  },
  {
    name: "Loaded Cheese Fries",
    price: 6,
    image: "/images/cheesefries.jpg",
    category: "fries",
    description: "Crispy fries topped with melted cheese and jalapeños."
  }
];

// ✅ Seed Function
const seedDB = async () => {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🗑️ Clearing old menu items...");
    await Menu.deleteMany();

    console.log("🍔 Inserting new menu items...");
    await Menu.insertMany(seedMenu);

    console.log("✅ Database seeded successfully with USD prices!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    mongoose.connection.close();
  }
};

seedDB();
