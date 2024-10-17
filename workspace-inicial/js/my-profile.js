// Función para alternar Modo Noche/Día y guardar la preferencia en localStorage
function toggleDarkMode() {
  const isDarkMode = document.getElementById('darkModeSwitch').checked;
  document.body.classList.toggle('bg-dark', isDarkMode);
  document.body.classList.toggle('text-white', isDarkMode);
  localStorage.setItem('darkMode', isDarkMode);
}

// Cargar preferencia de Modo Noche desde localStorage
function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  document.getElementById('darkModeSwitch').checked = darkMode;
  document.body.classList.toggle('bg-dark', darkMode);
  document.body.classList.toggle('text-white', darkMode);
}

// Cargar la imagen de perfil desde localStorage o usar la predeterminada
function loadProfileImage() {
  const profileImageSrc = localStorage.getItem('profileImage');
  const profileImageElement = document.getElementById('profileImage');
  
  if (profileImageSrc) {
    profileImageElement.src = profileImageSrc;
  } else {
    profileImageElement.src = 'img/img_perfil.png';
  }
}

// Guardar la imagen de perfil en localStorage cuando el usuario suba una nueva imagen
function handleProfileImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageDataUrl = e.target.result;
      document.getElementById('profileImage').src = imageDataUrl;
      localStorage.setItem('profileImage', imageDataUrl);
    };
    reader.readAsDataURL(file);
  }
}

// Cargar la información del perfil del usuario desde localStorage
function loadUserProfile() {
  const email = localStorage.getItem('email');

  if (email) {
    document.getElementById('email').value = email;
    document.getElementById('email').setAttribute('readonly', true);
  }

  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (userProfile) {
    document.getElementById('firstName').value = userProfile.firstName || '';
    document.getElementById('lastName').value = userProfile.lastName || '';
    document.getElementById('secondName').value = userProfile.secondName || '';
    document.getElementById('secondLastName').value = userProfile.secondLastName || '';
    document.getElementById('phone').value = userProfile.phone || '';
    localStorage.setItem('firstName', userProfile.firstName);
    updateUserNameMenu(userProfile.firstName);
  }
}

// Cargar nombre del usuario desde el objeto guardado en localStorage
function updateUserNameMenu(firstName) {
  const userNameMenu = document.getElementById('userNameMenu');
  userNameMenu.textContent = firstName || 'Usuario';
}

// Función para guardar la información del formulario en localStorage
function handleFormSubmit(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  // Obtener valores del formulario
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const secondName = document.getElementById('secondName').value;
  const secondLastName = document.getElementById('secondLastName').value;
  const phone = document.getElementById('phone').value;
  const email = localStorage.getItem('email'); // El email ya está guardado y es readonly
 
  // Verificar que los campos obligatorios (nombre y apellido) estén completos
  if (!firstName || !lastName) {
    alert('Por favor, complete los campos obligatorios (Nombre y Apellido).');
    return;
  }

  // Crear un objeto con los datos del usuario
  const userProfile = {
    firstName,
    lastName,
    secondName,
    secondLastName,
    phone,
    email,
  };

  // Guardar el perfil de usuario en localStorage
  localStorage.setItem('userProfile', JSON.stringify(userProfile));

  // Actualizar el nombre de usuario en el menú
  updateUserNameMenu(firstName);

  alert('Cambios guardados exitosamente.');
}

function logout() {
  // Limpiar todo el localStorage
  localStorage.clear();
  
  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = 'login.html';
}

// Cargar configuraciones iniciales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadDarkModePreference(); // Cargar preferencia de modo oscuro
  loadProfileImage(); // Cargar la imagen de perfil si está guardada
  loadUserProfile(); // Cargar el perfil de usuario desde localStorage

  // Evento para alternar modo día/noche y guardar preferencia
  document.getElementById('darkModeSwitch').addEventListener('change', toggleDarkMode);

  // Evento para cargar la imagen de perfil al subirla
  document.getElementById('profilePhoto').addEventListener('change', handleProfileImageUpload);

  // Evento para guardar los cambios del formulario
  document.getElementById('profileForm').addEventListener('submit', handleFormSubmit);
});




