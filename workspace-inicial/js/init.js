// URLs de las APIs
const CATEGORIES_URL = "http://localhost:3000/cats";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/sell";
const PRODUCTS_URL = "http://localhost:3000/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/products_comments/";
const CART_INFO_URL = "http://localhost:3000/user_cart/";
const CART_BUY_URL = "http://localhost:3000/cart";
const EXT_TYPE = ".json";

// Función para mostrar y ocultar el spinner
let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

// Función para obtener datos JSON de una URL
let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
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

// Función para cargar el menú
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
              <a href="#" class="nav-link cart-container" id="cart-icon">
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

  // Toggle sidebar on cart icon click
  document.querySelector("#cart-icon").addEventListener("click", (event) => {
    event.preventDefault();
    const cartSidebar = document.getElementById("cartSidebar");
    if (cartSidebar) {
      cartSidebar.classList.toggle("show"); // Show/hide sidebar
      addCartToHTML(); // Refresh cart content in sidebar
    }
  });
}

// Función para cargar el contenido del carrito en el sidebar
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

    cartContent.querySelectorAll(".minus").forEach((button) => {
      button.addEventListener("click", () => updateQuantity(button.dataset.index, -1));
    });
    cartContent.querySelectorAll(".plus").forEach((button) => {
      button.addEventListener("click", () => updateQuantity(button.dataset.index, 1));
    });
  } else {
    cartContent.innerHTML += '<p class="text-center">Tu carrito está vacío</p>';
  }

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

// Función para actualizar la cantidad en el carrito y sincronizar con localStorage
function updateQuantity(index, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart[index].quantity = 1; // Evita que la cantidad sea menor a 1
    localStorage.setItem("cart", JSON.stringify(cart)); // Guarda el carrito actualizado
    addCartToHTML(); // Vuelve a cargar el sidebar
    updateCartCount(); // Actualiza el contador del carrito
    window.dispatchEvent(new Event("storage")); // Emite un evento para sincronización en tiempo real
  }
}

// Función para actualizar la cantidad de productos en el ícono del carrito
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
  document.getElementById("cartCount").textContent = totalItems;
  localStorage.setItem("cartCount", totalItems);
}

// Cargar la preferencia de Modo Oscuro desde localStorage
function loadDarkModePreference() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("bg-dark", "text-white");
  } else {
    document.body.classList.remove("bg-dark", "text-white");
  }
}

// Cargar nombre del usuario desde localStorage en el menú
function loadUserNameMenu() {
  if (window.location.pathname !== "/login.html") {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const userNameMenu = document.getElementById("userNameMenu");
    if (userNameMenu) {
      userNameMenu.textContent = userProfile && userProfile.firstName ? userProfile.firstName : "Usuario";
    }
  }
}

// Función para cerrar sesión y limpiar el localStorage
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Sincronizar cambios en el carrito entre cart.js y init.js en tiempo real
window.addEventListener("storage", () => {
  addCartToHTML();
  updateCartCount();
});

// Cargar configuraciones iniciales al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("login.html")) {
    loadMenu();
    loadDarkModePreference();
  }
});
