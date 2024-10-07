// Función para alternar Modo Noche/Día
function toggleDarkMode() {
    const isDarkMode = document.getElementById('darkModeSwitch').checked;
    document.body.classList.toggle('bg-dark', isDarkMode);
    document.body.classList.toggle('text-white', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }
  
  // Cargar preferencia de Modo Noche
  function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.getElementById('darkModeSwitch').checked = darkMode;
    toggleDarkMode();
  }
  
  // Cargar imagen de perfil desde localStorage
  function loadProfileImage() {
    const profileImageSrc = localStorage.getItem('profileImage');
    if (profileImageSrc) {
      document.getElementById('profileImage').src = profileImageSrc;
    }
  }
  
  // Guardar imagen de perfil en localStorage cuando se sube una nueva imagen
  function handleProfileImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageDataUrl = e.target.result;
        document.getElementById('profileImage').src = imageDataUrl;
        localStorage.setItem('profileImage', imageDataUrl); // Guardar en localStorage
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Cargar nombre del usuario desde localStorage en el menú
  function loadUserNameMenu() {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      document.getElementById('userNameMenu').textContent = storedName;
    }
  }
  
  // Guardar el nombre de usuario en localStorage y actualizar el menú
  function updateUserNameMenu() {
    const firstNameInput = document.getElementById('firstName').value;
    localStorage.setItem('username', firstNameInput); // Guardar el nombre en localStorage
    document.getElementById('userNameMenu').textContent = firstNameInput || 'Usuario'; // Mostrar 'Usuario' si está vacío
  }
  
  // Función para guardar todos los cambios (nombre e imagen)
  function handleFormSubmit(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    updateUserNameMenu(); // Actualizar el nombre en el menú
  }
  
  // Cargar configuraciones iniciales al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    loadDarkModePreference();
    loadProfileImage();
    loadUserNameMenu(); // Cargar el nombre de usuario almacenado
  
    // Evento para cargar la imagen de perfil al subirla
    document.getElementById('profilePhoto').addEventListener('change', handleProfileImageUpload);
  
    // Evento para guardar los cambios del formulario
    document.getElementById('profileForm').addEventListener('submit', handleFormSubmit);
  });  