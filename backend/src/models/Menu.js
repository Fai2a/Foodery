// import mongoose from "mongoose";

// const menuSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   category: {
//     type: String,
//     enum: ["burger", "pizza", "pasta", "fries", "sandwich"], // Added "sandwich" etc.
//     required: true
//   },
//   description: {
//     type: String,
//     default: ""
//   }
// });

// export default mongoose.model("Menu", menuSchema);

// backend/models/Menu.js
import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String, // store '/images/burger.jpg'
  category: String,
  description: String
});

export default mongoose.model("Menu", menuSchema);
