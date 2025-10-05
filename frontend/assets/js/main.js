// ===== Navbar Toggle =====
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// ===== Menu Filtering =====
const filterBtns = document.querySelectorAll(".filter-btn");
const menuItems = document.querySelectorAll(".menu-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove "active" class from all buttons
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-category");

    menuItems.forEach((item) => {
      if (category === "all" || item.classList.contains(category)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// const cartButtons = document.querySelectorAll(".add-to-cart");

cartButtons.forEach(button => {
  button.addEventListener("click", () => {
    alert("✅ Item added to cart!");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.querySelector(".menu-container");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Fetch menu items from backend
  fetch("http://localhost:5000/api/menu")
    .then(res => res.json())
    .then(data => {
      menuContainer.innerHTML = ""; // Clear loading text

      data.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("menu-item", item.category);

        div.innerHTML = `
          <img src="./assets/images/${item.image}" alt="${item.name}">
          <div class="menu-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <span>$${item.price}</span>
          </div>
          <button class="add-to-cart">Add to Cart</button>
        `;

        menuContainer.appendChild(div);
      });

      // Filter functionality
      filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          filterBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          const category = btn.getAttribute("data-category");
          document.querySelectorAll(".menu-item").forEach(item => {
            if (category === "all" || item.classList.contains(category)) {
              item.style.display = "block";
            } else {
              item.style.display = "none";
            }
          });
        });
      });
    })
    .catch(err => {
      console.error("Error fetching menu:", err);
      menuContainer.innerHTML = `<p class="error-text">⚠️ Failed to load menu items. Please try again later.</p>`;
    });
});


