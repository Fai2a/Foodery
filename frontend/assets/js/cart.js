const API_URL = "http://localhost:5000/api/cart"; // backend cart API

// For now fix userId (later use login system)
const userId = "user123"; 

// Fetch cart
async function fetchCart() {
  try {
    const res = await fetch(`${API_URL}/${userId}`);
    const data = await res.json();

    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = "";

    if (data.items.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      document.getElementById("total").innerText = "";
      return;
    }

    let total = 0;

    data.items.forEach(item => {
      total += item.menuId.price * item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.menuId.image}" width="60" />
        <strong>${item.menuId.name}</strong> - $${item.menuId.price}
        <br>
        Quantity: 
        <button onclick="updateQuantity('${item.menuId._id}', ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity('${item.menuId._id}', ${item.quantity + 1})">+</button>
        <button onclick="removeItem('${item.menuId._id}')">❌ Remove</button>
      `;
      cartContainer.appendChild(div);
    });

    document.getElementById("total").innerText = `Total: $${total}`;
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
}

// Update quantity
async function updateQuantity(menuId, quantity) {
  if (quantity <= 0) {
    return removeItem(menuId);
  }

  await fetch(`${API_URL}/update/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menuId, quantity })
  });

  fetchCart();
}

// Remove item
async function removeItem(menuId) {
  await fetch(`${API_URL}/remove/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menuId })
  });

  fetchCart();
}

// First load
fetchCart();
