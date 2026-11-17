
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1499,
    image: "https://placehold.co/300x200?text=Headphones",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 1999,
    image: "https://placehold.co/300x200?text=Smart+Watch",
    category: "Electronics"
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 1299,
    image: "https://placehold.co/300x200?text=Shoes",
    category: "Fashion"
  },
  {
    id: 4,
    name: "Backpack",
    price: 899,
    image: "https://placehold.co/300x200?text=Backpack",
    category: "Fashion"
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 999,
    image: "https://placehold.co/300x200?text=Speaker",
    category: "Electronics"
  },
  {
    id: 6,
    name: "Sunglasses",
    price: 599,
    image: "https://placehold.co/300x200?text=Sunglasses",
    category: "Fashion"
  }
];

let cart = [];
let wishlist = [];
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

  <button onclick="addToCart(${product.id})">
    Add to Cart
  </button>

  <button onclick="addToWishlist(${product.id})">
    ❤️ Wishlist
  </button>
`;


    productList.appendChild(card);
  });
}

// Add product to wishlist
function addToWishlist(id) {
  const product = products.find(item => item.id === id);

  const alreadyAdded = wishlist.some(item => item.id === id);

  if (!alreadyAdded && product) {
    wishlist.push(product);
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
        <button onclick="removeFromWishlist(${item.id})">
          Remove
        </button>
      </p>
    `;

    wishlistItems.appendChild(row);
  });
}

// Remove from wishlist
function removeFromWishlist(id) {
  wishlist = wishlist.filter(item => item.id !== id);
  displayWishlist();
}

function filterProducts() {
  const searchText = document
    .getElementById("search-input")
    .value.toLowerCase().trim();

  const selectedCategory = document
    .getElementById("category-filter")
    .value;

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filteredProducts);
}

document
  .getElementById("search-input")
  .addEventListener("input", filterProducts);

document
  .getElementById("category-filter")
  .addEventListener("change", filterProducts);


// Add product to cart
function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    const product = products.find(item => item.id === id);

    cart.push({
      ...product,
      quantity: 1
    });
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

// Update shopping cart
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
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

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
}

// Initial display
displayProducts();
updateCart();
displayWishlist();
