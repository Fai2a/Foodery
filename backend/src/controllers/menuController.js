import Menu from "../models/Menu.js";

/* ============================
📌 Get All Menu Items
============================ */
export const getAll = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json({ success: true, data: menuItems });
  } catch (err) {
    console.error("❌ Error fetching menu:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ============================
📌 Get Single Menu Item by ID
============================ */
export const getById = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error("❌ Error fetching item:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ============================
📌 Create New Menu Item
============================ */
export const create = async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;

    if (!name || !price || !image || !category) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const newItem = new Menu({ name, price, image, category, description });
    await newItem.save();

    res.json({ success: true, message: "Menu item created successfully!", data: newItem });
  } catch (err) {
    console.error("❌ Error creating menu:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ============================
📌 Update Menu Item
============================ */
export const update = async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, message: "Menu item updated successfully!", data: updatedItem });
  } catch (err) {
    console.error("❌ Error updating menu:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ============================
📌 Delete Menu Item
============================ */
export const remove = async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, message: "Menu item deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting menu:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
