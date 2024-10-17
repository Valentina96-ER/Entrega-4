document.addEventListener("DOMContentLoaded", function() {
  // Agregar eventos de clic para las categorías
  document.getElementById("autos").addEventListener("click", function() {
      localStorage.setItem("catID", 101);
      window.location = "products.html";
  });

  document.getElementById("juguetes").addEventListener("click", function() {
      localStorage.setItem("catID", 102);
      window.location = "products.html";
  });

  document.getElementById("muebles").addEventListener("click", function() {
      localStorage.setItem("catID", 103);
      window.location = "products.html";
  });

  // Verificar si el usuario está logueado
  if (localStorage.getItem('isLoggedIn') !== 'true') {
      window.location.href = 'login.html';
  }

  // Cargar nombre del usuario desde localStorage en el menú
  loadUserNameMenu();

  // Cargar preferencia de Modo Noche
  loadDarkModePreference();
});

  // Cargar nombre del usuario desde localStorage en el menú
  function loadUserNameMenu() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile')); // Obtiene el objeto guardado en localStorage
    if (userProfile && userProfile.firstName) { 
      document.getElementById('userNameMenu').textContent = userProfile.firstName; // Si existe el firstName, lo muestra en el menú
    } else {
      document.getElementById('userNameMenu').textContent = 'Usuario'; // Si no hay firstName, muestra 'Usuario'
    }
  }

