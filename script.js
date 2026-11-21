
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1499,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 1999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    category: "Electronics"
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 1299,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    category: "Fashion"
  },
  {
    id: 4,
    name: "Backpack",
    price: 899,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    category: "Fashion"
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 999,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    category: "Electronics"
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 599,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    category: "Fashion"
  }
];

// Load saved data
function loadSavedData(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

// Save data
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

let cart = loadSavedData("shopsphere-cart");
let wishlist = loadSavedData("shopsphere-wishlist");

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const totalElement = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const wishlistItems = document.getElementById("wishlist-items");

// Display products
function displayProducts(items = products) {
  productList.innerHTML = "";

  if (items.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  items.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price.toLocaleString("en-IN")}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
      <button onclick="addToWishlist(${product.id})">❤️ Wishlist</button>
    `;

    productList.appendChild(card);
  });
}

// Add to wishlist
function addToWishlist(id) {
  const product = products.find(item => item.id === id);
  const alreadyAdded = wishlist.some(item => item.id === id);

  if (!alreadyAdded && product) {
    wishlist.push(product);
    saveData("shopsphere-wishlist", wishlist);
    displayWishlist();
    alert("Added to Wishlist!");
  } else {
    alert("Already in Wishlist!");
  }
}

// Display wishlist
function displayWishlist() {
  wishlistItems.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistItems.textContent = "Your wishlist is empty.";
    return;
  }

  wishlist.forEach(item => {
    const row = document.createElement("div");

    row.innerHTML = `
      <p>
        ${item.name} - ₹${item.price}
        <button onclick="removeFromWishlist(${item.id})">Remove</button>
      </p>
    `;

    wishlistItems.appendChild(row);
  });
}

// Remove from wishlist
function removeFromWishlist(id) {
  wishlist = wishlist.filter(item => item.id !== id);
  saveData("shopsphere-wishlist", wishlist);
  displayWishlist();
}

// Search and filter
function filterProducts() {
  const searchText = document
    .getElementById("search-input")
    .value.toLowerCase().trim();

  const selectedCategory = document
    .getElementById("category-filter")
    .value;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filteredProducts);
}

document.getElementById("search-input")
  .addEventListener("input", filterProducts);

document.getElementById("category-filter")
  .addEventListener("change", filterProducts);

// Add to cart
function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    const product = products.find(item => item.id === id);
    if (!product) return;

    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}

// Change quantity
function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  updateCart();
}

// Update cart and save it
function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.textContent = "Your cart is empty.";
  }

  let total = 0;

  cartCount.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cart.forEach(item => {
    total += item.price * item.quantity;

    const row = document.createElement("div");

    row.innerHTML = `
      <p>
        ${item.name} - ₹${item.price}
        <br>
        Quantity: ${item.quantity}
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
      </p>
    `;

    cartItems.appendChild(row);
  });

  totalElement.textContent =
    "Total: ₹" + total.toLocaleString("en-IN");

  saveData("shopsphere-cart", cart);
}

// Open checkout
function showCheckout() {
  if (cart.length === 0) {
    alert("Your shopping cart is empty!");
    return;
  }

  const checkout = document.getElementById("checkout");
  const summary = document.getElementById("checkout-summary");

  let total = 0;
  summary.innerHTML = "";

  cart.forEach(item => {
    total += item.price * item.quantity;

    const row = document.createElement("p");
    row.textContent =
      item.name + " x " + item.quantity +
      " = ₹" + (item.price * item.quantity);

    summary.appendChild(row);
  });

  document.getElementById("checkout-total").textContent =
    "Total: ₹" + total.toLocaleString("en-IN");

  document.getElementById("order-message").textContent = "";

  checkout.hidden = false;
  checkout.scrollIntoView({ behavior: "smooth" });
}

// Return to cart
function hideCheckout() {
  document.getElementById("checkout").hidden = true;
}

// Demo order
function placeDemoOrder() {
  if (cart.length === 0) return;

  const orderNumber = "SS" + Date.now().toString().slice(-6);

  document.getElementById("order-message").textContent =
    "Order placed successfully! Demo Order ID: " + orderNumber;

  cart = [];
  updateCart();

  alert("Your ShopSphere demo order is successful!");

  document.getElementById("checkout").hidden = true;
}

// Initial display
displayProducts();
updateCart();
displayWishlist();

