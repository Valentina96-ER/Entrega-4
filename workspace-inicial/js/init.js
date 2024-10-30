// URLs of APIs
const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

// Function to show and hide the spinner
let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

// Function to fetch JSON data from a URL
let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

// Function to load Dark Mode preference from localStorage
function loadDarkModePreference() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("bg-dark", "text-white");
  } else {
    document.body.classList.remove("bg-dark", "text-white");
  }
}

// Function to load user name in the menu from localStorage
function loadUserNameMenu() {
  if (window.location.pathname !== "/login.html") {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const userNameMenu = document.getElementById("userNameMenu");
    if (userNameMenu) {
      userNameMenu.textContent = userProfile && userProfile.firstName ? userProfile.firstName : "Usuario";
    }
  }
}

// Function to logout and clear localStorage
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Function to load the menu
function loadMenu() {
  const menuHtml = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-1">
      <div class="container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav w-100 justify-content-between">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="categories.html">Categorías</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="sell.html">Vender</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="userNameMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Usuario
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="my-profile.html">Mi Perfil</a></li>
                <li><a class="dropdown-item" href="cart.html">Mi Carrito</a></li>
                <li><a class="dropdown-item" href="login.html" onclick="logout()">Cerrar Sesión</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link cart-container">
                <i class="bi bi-cart"></i>
                <span id="cartCount">0</span>
              </a>
            </li>      
          </ul>
        </div>
      </div>
    </nav>
    <main>
  `;
  document.querySelector("#menu-container").innerHTML = menuHtml;

  loadUserNameMenu();
  updateCartCount();

  // Add event listener for the cart icon
  document.querySelector('.cart-container').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.toggle('show');
    addCartToHTML(); // Populate the cart when opened
  });
}

// Function to update cart count from localStorage
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
  document.getElementById("cartCount").textContent = totalItems;
  localStorage.setItem("cartCount", totalItems);
}

// Function to add items to the cart and update localStorage
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Function to render the cart in the sidebar
function addCartToHTML() {
  const cartContent = document.getElementById("cartContent");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  cartContent.innerHTML = '<h2 class="text-center">Resumen de compras</h2>';
  
  if (cart.length > 0) {
    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item", "d-flex", "align-items-center", "mb-2");
      itemDiv.innerHTML = `
        <div class="image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="name text-wrap">${item.name}</div>
        <div class="price text-end">$${item.cost.toLocaleString()}</div>
        <div class="currency text-center">${item.currency}</div>
        <div class="quantity text-end">
          <button class="btn btn-outline-secondary minus" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-outline-secondary plus" data-index="${index}">+</button>
        </div>
      `;
      cartContent.appendChild(itemDiv);
    });

    // Event listeners for quantity buttons
    cartContent.querySelectorAll(".minus").forEach(button => {
      button.addEventListener("click", () => updateQuantity(button.dataset.index, -1));
    });
    cartContent.querySelectorAll(".plus").forEach(button => {
      button.addEventListener("click", () => updateQuantity(button.dataset.index, 1));
    });
  } else {
    cartContent.innerHTML += '<p class="text-center">Your cart is empty</p>';
  }

  // Bottom buttons
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group", "d-flex", "justify-content-between", "mt-3");
  btnGroup.innerHTML = `
    <button class="btn btn-secondary close">Cerrar</button>
    <button class="btn btn-warning goToCart" onclick="window.location.href='cart.html'">Ir al carrito</button>
  `;
  cartContent.appendChild(btnGroup);

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("cartSidebar").classList.remove("show");
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("login.html")) {
    loadDarkModePreference();
    loadMenu();
  }
});

