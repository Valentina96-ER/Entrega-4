const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
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

// Cargar preferencia de Modo Noche/Día desde localStorage
function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('bg-dark');
    document.body.classList.add('text-white'); 
  } else {
    document.body.classList.remove('bg-dark'); // Remueve la clase dark-mode
  }
}

// Cargar nombre del usuario desde localStorage en el menú
function loadUserNameMenu() {
  // Solo cargar el nombre si no es la página de login.html
  if (window.location.pathname !== '/login.html') {
    const userProfile = JSON.parse(localStorage.getItem('userProfile')); // Obtiene el objeto guardado en localStorage
    const userNameMenu = document.getElementById('userNameMenu'); // Intenta obtener el elemento
    if (userNameMenu) { // Verifica si el elemento existe antes de intentar usarlo
      if (userProfile && userProfile.firstName) { 
        userNameMenu.textContent = userProfile.firstName; // Si existe el firstName, lo muestra en el menú
      } else {
        userNameMenu.textContent = 'Usuario'; // Si no hay firstName, muestra 'Usuario'
      }
    }
  }
}

function logout() {
  // Limpiar todo el localStorage
  localStorage.clear();
  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = 'login.html';
} 

// Cargar configuraciones iniciales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('login.html')){
    loadDarkModePreference(); // Cargar preferencia de Modo Noche en otras páginas
    loadUserNameMenu(); // Cargar el nombre del usuario en otras páginas
  }
});

