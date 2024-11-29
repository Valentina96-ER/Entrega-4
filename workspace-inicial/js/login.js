document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    let email = document.getElementById('username').value; // Usamos 'email' en lugar de 'username'
    let password = document.getElementById('password').value;

    // Verificar si los campos están completos
    if (email !== "" && password !== "") {
        // Hacer la solicitud POST al backend para verificar el login
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, password: password })  // Enviar las credenciales al backend
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // Si el login es exitoso, almacenar el token en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('email', email);  // Guardar el email en localStorage

                // Redirigir al perfil
                window.location.href = 'my-profile.html';
            } else {
                // Si el login falla, mostrar mensaje de error
                let errorMessage = document.getElementById('error-message');
                errorMessage.textContent = 'Credenciales incorrectas, por favor intente de nuevo.';
            }
        })
        .catch(error => {
            console.error('Error al hacer login:', error);
            let errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'Hubo un problema con el servidor. Intenta más tarde.';
        });
    } else {
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Por favor, ingrese ambos campos';
    }
});

