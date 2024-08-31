document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

//desafiate
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
});

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
    localStorage.removeItem('username'); //desafiate
});
//desafiate:
document.addEventListener('DOMContentLoaded', function() {
    
    const username = localStorage.getItem('username');

        if (username) {
          const usernameDisplay = document.getElementById('username-display');
      usernameDisplay.textContent = `${username}`;
    } else {
      console.log('No se encontró un nombre de usuario en localStorage.');
    }
  });