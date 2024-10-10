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

function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
      document.body.classList.add('bg-dark');
      document.body.classList.add('text-white');
  } else {
      document.body.classList.remove('bg-dark');
      document.body.classList.remove('text-white');
  }
}

function logout() {
  // Limpiar todo el localStorage
  localStorage.clear();
  
  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = 'login.html';
}

  