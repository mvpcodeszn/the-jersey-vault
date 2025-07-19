
// Display cart items
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalContainer = document.getElementById("cart-total");
  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalContainer.innerHTML = "";
    return;
  }

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    container.innerHTML += `
      <div class="cart-item">
        <h3>${item.name}</h3>
        <p>$${item.price} x ${item.qty} = $${subtotal}</p>
        <button onclick="removeItem(${index})" class="remove-btn">Remove</button>
      </div>
    `;
  });

  totalContainer.innerHTML = `<h2>Total: $${total}</h2>`;
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
}

// Only run on cart.html
if (window.location.pathname.includes("cart.html")) {
  displayCart();
}
function filterProducts() {
  const input = document.getElementById("search").value.toLowerCase();
  const products = document.querySelectorAll(".product");

  products.forEach(product => {
    const title = product.querySelector("h3").textContent.toLowerCase();
    if (title.includes(input)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}
function displayCheckoutSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("checkout-summary");
  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    container.innerHTML += `
      <p>${item.name} (${item.qty}) - $${subtotal}</p>
    `;
  });

  container.innerHTML += `<h3>Total: $${total}</h3>`;
}

function placeOrder(event) {
  event.preventDefault();
  const form = document.getElementById("checkout-form");
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const address = form.address.value.trim();

  if (name && email && address) {
    alert("Order placed successfully!\nThank you, " + name + " 🎉");
    localStorage.removeItem("cart");
    form.reset();
    window.location.href = "index.html";
  } else {
    alert("Please fill in all the fields.");
  }
}

// Only run on checkout.html
if (window.location.pathname.includes("checkout.html")) {
  displayCheckoutSummary();
}
// Auto slideshow for each product image group
function startSlideshows() {
  const products = document.querySelectorAll('.product');

  products.forEach(product => {
    const slides = product.querySelectorAll('.slide');
    let index = 0;

    if (slides.length < 2) return; // Skip if only 1 image

    setInterval(() => {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }, 3000); // change image every 3 seconds
  });
}

// Only run on shop.html
if (window.location.pathname.includes("shop.html")) {
  window.addEventListener("DOMContentLoaded", startSlideshows);
}
function nextSlide(button) {
  const slider = button.closest(".slider");
  const slides = slider.querySelectorAll(".slide");
  let index = Array.from(slides).findIndex(s => s.classList.contains("active"));

  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

function prevSlide(button) {
  const slider = button.closest(".slider");
  const slides = slider.querySelectorAll(".slide");
  let index = Array.from(slides).findIndex(s => s.classList.contains("active"));

  slides[index].classList.remove("active");
  index = (index - 1 + slides.length) % slides.length;
  slides[index].classList.add("active");
};
function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach(product => {
    let slidesHTML = product.images.map((img, i) =>
      `<img src="${img}" class="slide ${i === 0 ? 'active' : ''}" alt="${product.name}">`
    ).join("");

    container.innerHTML += `
      <div class="product" data-id="${product.id}" data-category="${product.category}">
        <div class="slider">
          ${slidesHTML}
          <button class="prev" onclick="prevSlide(this)">&#10094;</button>
          <button class="next" onclick="nextSlide(this)">&#10095;</button>
        </div>
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}
// Call it on load
if (window.location.pathname.includes("shop.html")) {
  renderProducts();
}
let products = [];

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach(product => {
    const slidesHTML = product.images.map((img, i) =>
      `<img src="${img}" class="slide ${i === 0 ? 'active' : ''}" alt="${product.name}">`
    ).join("");

    container.innerHTML += `
      <div class="product" data-id="${product.id}" data-category="${product.category}">
        <div class="slider">
          ${slidesHTML}
          <button class="prev" onclick="prevSlide(this)">&#10094;</button>
          <button class="next" onclick="nextSlide(this)">&#10095;</button>
        </div>
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

if (window.location.pathname.includes("shop.html")) {
  fetch('products.json')
    .then(res => res.json())
    .then(data => {
      products = data;
      renderProducts();
    });
}
function handleSearch(input) {
  const query = input.value.toLowerCase();
  const clearBtn = document.querySelector(".clear-icon");
  const suggestions = document.getElementById("suggestions");

  // Toggle clear icon
  clearBtn.style.display = query ? "block" : "none";

  // Filter suggestions
  if (!query) {
    suggestions.style.display = "none";
    return;
  }

  const matches = products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    suggestions.style.display = "none";
    return;
  }

  // Show suggestions
  suggestions.innerHTML = matches.map(p => `<li onclick="selectSuggestion('${p.name}')">${p.name}</li>`).join("");
  suggestions.style.display = "block";
}

function clearSearch() {
  const input = document.getElementById("search");
  input.value = "";
  document.querySelector(".clear-icon").style.display = "none";
  document.getElementById("suggestions").style.display = "none";
  filterProducts(); // Optionally show all products again
}

function selectSuggestion(name) {
  const input = document.getElementById("search");
  input.value = name;
  document.querySelector(".clear-icon").style.display = "block";
  document.getElementById("suggestions").style.display = "none";
  filterProducts(); // Trigger filter
}
  const toggle = document.getElementById('darkToggle');
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Load saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

 