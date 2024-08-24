document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // Aquí deberías realizar la validación con tu backend
    // Este es solo un ejemplo simple
    if (username !== "" && password !== "") {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
        } else {
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Por favor, ingrese ambos campos';
    }

});