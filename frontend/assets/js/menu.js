document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".menu-container");

  const res = await fetch("http://localhost:5000/api/menu");
  const data = await res.json();

  container.innerHTML = data.map(item => `
    <div class="menu-item" data-id="${item._id}">
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <span class="price">Rs. ${item.price}</span>
      <button class="add-to-cart">Add to Cart</button>
    </div>
  `).join("");

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const itemDiv = e.target.closest(".menu-item");
      const id = itemDiv.dataset.id;
      const name = itemDiv.querySelector("h3").textContent;
      const price = parseFloat(itemDiv.querySelector(".price").textContent.replace("Rs. ", ""));
      const image = itemDiv.querySelector("img").src;

      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId: id, name, price, image })
      });

      loadCart();
    });
  });

  loadCart();
});
