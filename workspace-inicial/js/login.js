document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

// agregue funcion que redireccione al sitio portada cuando se presiona INGRESAR
// en el caso de no completar un campo le sale el alert de abajo
    if (username !== "" && password !== "") {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
        } else {
        let errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Por favor, ingrese ambos campos';
    }
});