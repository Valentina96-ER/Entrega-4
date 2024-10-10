



// Cargar preferencia de Modo Noche
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
  
  // Cargar nombre del usuario desde localStorage en el menú
  function loadUserNameMenu() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile')); // Obtiene el objeto guardado en localStorage
    if (userProfile && userProfile.firstName) { 
      document.getElementById('userNameMenu').textContent = userProfile.firstName; // Si existe el firstName, lo muestra en el menú
    } else {
      document.getElementById('userNameMenu').textContent = 'Usuario'; // Si no hay firstName, muestra 'Usuario'
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
    loadDarkModePreference();
    loadUserNameMenu();
  });
  