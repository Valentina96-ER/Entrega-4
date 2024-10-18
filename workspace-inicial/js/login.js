document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    let email = document.getElementById('username').value; // Usamos 'email' en lugar de 'username'
    let password = document.getElementById('password').value;

    // Verificar si los campos están completos
    if (email !== "" && password !== "") {
        // Obtener los usuarios almacenados en localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Verificar si el email ya está registrado
        const userExists = storedUsers.some(user => user.email === email);

        if (!userExists) {
            // Guardar el nuevo usuario en localStorage
            storedUsers.push({ email: email, password: password });
            localStorage.setItem('users', JSON.stringify(storedUsers));

            // Establecer que el usuario está logueado
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('email', email); // Guardar el email en localStorage

            // Redirigir a la página de perfil
            window.location.href = 'my-profile.html';
        } else {
            // Si el usuario ya existe, redirigir a index.html
            window.location.href = 'index.html';
        }
    } else {
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Por favor, ingrese ambos campos';
    }
});
