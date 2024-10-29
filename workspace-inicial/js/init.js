// URLs de las APIs
const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

// Función para mostrar y ocultar el spinner
let showSpinner = function() {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function() {
  document.getElementById("spinner-wrapper").style.display = "none";
}

// Función para obtener datos JSON de una URL
let getJSONData = function(url) {
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
    .then(function(response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function(error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

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
              <a class="nav-link cart-container" href="cart.html">
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

  loadUserNameMenu(); // Cargar nombre del usuario en el menú
  updateCartCount(); // Actualizar la cantidad de productos en el carrito
}

// Función para actualizar la cantidad del carrito desde localStorage
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
  document.getElementById("cartCount").textContent = totalItems;
  localStorage.setItem("cartCount", totalItems); // Guardar en localStorage
}

// Función para agregar un producto al carrito y actualizar localStorage
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Verificar si el producto ya está en el carrito
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += product.quantity; // Sumar la cantidad si ya existe
  } else {
    cart.push(product); // Agregar el producto nuevo
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Cargar preferencia de Modo Noche/Día desde localStorage
function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('bg-dark');
    document.body.classList.add('text-white'); 
  } else {
    document.body.classList.remove('bg-dark');
  }
}

// Cargar nombre del usuario desde localStorage en el menú
function loadUserNameMenu() {
  if (window.location.pathname !== '/login.html') {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const userNameMenu = document.getElementById('userNameMenu');
    if (userNameMenu) {
      userNameMenu.textContent = userProfile && userProfile.firstName ? userProfile.firstName : 'Usuario';
    }
  }
}

// Función para cerrar sesión y limpiar el localStorage
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
} 

// Cargar configuraciones iniciales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('login.html')) {
    loadDarkModePreference();
    loadMenu(); // Cargar el menú en todas las páginas excepto en login.html
  }
});
