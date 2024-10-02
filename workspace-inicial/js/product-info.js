const productID = localStorage.getItem("productID");
document.addEventListener("DOMContentLoaded", function () {


    if (productID) {
        fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
            .then(response => response.json())
            .then(data => {
                const product = data;
                console.log(product); // Verificar los productos
                showData(product); // Mostrar el producto

                // Una vez que el producto y el formulario han sido agregados al DOM, se añade el evento de 'submit'
                const ratingForm = document.getElementById('rating-form');

                ratingForm.addEventListener('submit', function (event) {
                    event.preventDefault(); // Evitar que se recargue la página

                    const comment = document.getElementById('rating-text').value;
                    const score = document.getElementById('rating-score').textContent.match(/\d+/)[0]; // Obtiene el valor de la puntuación seleccionada en las estrellas
                    const username = localStorage.getItem('username') || 'Usuario Anónimo';  // Obtener el nombre de usuario desde localStorage, o un valor por defecto
                    
                    var options = { year: '2-digit', month: '2-digit', day: '2-digit' };
                    const currentDate = new Date().toLocaleDateString("en-GB",options);
                   

                    if (comment && score) {
                        // Crear un nuevo objeto de calificación
                        const newRating = {
                            user: username,  // Usar el nombre de usuario almacenado o un valor por defecto
                            description: comment,
                            score: parseInt(score),
                            date: currentDate,
                        };

                        // Guardar en localStorage
                        let storedRatings = JSON.parse(localStorage.getItem(`ratings-${productID}`)) || [];
                        storedRatings.push(newRating); // Agregar la nueva calificación al array de calificaciones almacenadas.
                        localStorage.setItem(`ratings-${productID}`, JSON.stringify(storedRatings)); // Guardar el array actualizado de calificaciones en localStorage.

                        // Mostrar la calificación inmediatamente
                        addRatingToDOM(newRating);  // Agregar la nueva calificación al DOM sin recargar la página

                        // Limpiar el formulario
                        ratingForm.reset();
                        updateRating(0);  // Restablecer la selección de estrellas
                    } else {
                        alert("Por favor, ingrese un comentario y seleccione una puntuación.");
                    }
                });

                fetchRatings();  // Cargar y mostrar las calificaciones del servidor
                loadLocalRatings();  // Cargar y mostrar calificaciones del localStorage
            })
            .catch(error => console.error('Error al cargar el producto:', error));
    } else {
        console.error('No se ha encontrado un productID en el almacenamiento local.');
    }
});

function showData(product) {
    const container = document.getElementById("container");
    container.innerHTML = ''; // Limpiar el contenedor antes de mostrar los nuevos productos

    if (product) {
        const formattedCost = formatNumber(product.cost);  // Formatear el costo

        const productInfoHTML = `
        <div class="container mt-4">
            <!-- Nombre de la categoría -->
            <div class="row">
            <div class="col-12">
                <h3><strong>${product.category}</strong></h3>
            </div>
            </div>

            <div class="row">
            <!-- Columna de imágenes -->
            <div class="col-md-8 d-flex flex-column justify-content-between">
                <!-- Imagen grande del producto -->
                <div class="row mb-4">
                <div class="col-12">
                    <img src="${product.images[0]}" class="img-fluid w-100 rounded" alt="${product.name}">
                </div>
                </div>
                <!-- Mosaico de imágenes adicionales -->
                <div class="row">
                <div class="col-4">
                    <img src="${product.images[1]}" class="rounded img-fluid" alt="${product.name}">
                </div>
                <div class="col-4">
                    <img src="${product.images[2]}" class="rounded img-fluid" alt="${product.name}">
                </div>
                <div class="col-4">
                    <img src="${product.images[3]}" class="rounded img-fluid" alt="${product.name}">
                </div>
                </div>
            </div>
            
            <!-- Columna de información del producto -->
            <div class="col-md-4 d-flex flex-column justify-content-between">
                <div class="row mb-4">
                <div class="col-12">
                    <h2><strong>${product.name}</strong></h2>
                    <div id="average-stars-container"></div> <!-- Contenedor para estrellas promedio -->
                    <p>${product.description}</p>
                    <h4>Precio: ${product.currency} ${formattedCost}</h4>
                    <p>Cantidad de vendidos: ${product.soldCount}</p>
                </div>  
                </div>
                
                <!-- Productos relacionados -->
                <div class="row">
                <h4 class="text-center">Productos relacionados</h4>
                ${product.relatedProducts.map(related => `
                    <div class="col-6 text-center cursor-pointer" onclick="setProductID(${related.id})">
                    <img src="${related.image}" class="img-fluid w-75" alt="${related.name}">
                    <p>${related.name}</p>
                    </div>
                `).join('')}
                </div>
            </div>
            </div>
        </div>
        <!-- Sección de calificaciones -->
                    <h4>Calificaciones de los usuarios</h4>
                    <div id="ratings"></div>
                </div> 
        <!-- Formulario para realizar una calificación -->
        <div class="container mt-4">
            <h4>Deja tu calificación</h4>
            <form id="rating-form">
                <div class="mb-3">
                    <label for="rating-text" class="form-label">Comentario</label>
                    <textarea id="rating-text" class="form-control" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label for="rating-score" class="form-label">Puntuación</label>

                    <div id="star-rating" class="star-rating">
                        <span class="fa fa-star" data-value="1"></span>
                        <span class="fa fa-star" data-value="2"></span>
                        <span class="fa fa-star" data-value="3"></span>
                        <span class="fa fa-star" data-value="4"></span>
                        <span class="fa fa-star" data-value="5"></span>
                    </div>
                    <p id="rating-score"></p>

                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
            </form>
        </div>
        `;


        container.innerHTML = productInfoHTML;

        // Ahora que las estrellas del formulario están en el DOM, agrega los eventos de clic
        const starRatingContainer = document.getElementById('star-rating');
        const stars = starRatingContainer.querySelectorAll('.fa-star');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                updateRating(index + 1);
            });
        });
    }
}

function updateRating(rating) {
    const stars = document.querySelectorAll('#star-rating .fa-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('checked');
            star.style.color = '#ffd700';  // Estrella dorada
        } else {
            star.classList.remove('checked');
            star.style.color = '#ccc';  // Estrella gris
        }
    });
    document.getElementById('rating-score').textContent = `Puntuación: ${rating}`;
}

function fetchRatings() {
    fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
        .then(response => response.json())
        .then(data => {
            const ratingsContainer = document.getElementById('ratings');

            let totalScore = 0;  // Variable para almacenar la suma de las calificaciones
            let numberOfRatings = data.length;  // Número total de calificaciones

            data.forEach(comentario => {
                const divComentario = document.createElement('div');
                divComentario.classList.add('ratings-row');

                // Crear el nombre del usuario
                const userElement = document.createElement('h5');
                userElement.textContent = comentario.user;
                divComentario.appendChild(userElement);

                // Crear las estrellas usando Font Awesome
                const calificacion = Math.round(comentario.score);

                totalScore += calificacion;  // Sumar la calificación al total

                for (let i = 0; i < 5; i++) {
                    const estrella = document.createElement('span');
                    estrella.classList.add('fa', 'fa-star');
                    if (i < calificacion) {
                        estrella.classList.add('checked');
                    }
                    divComentario.appendChild(estrella);
                }

                // Crear el comentario
                const comentarioElement = document.createElement('p');
                comentarioElement.textContent = comentario.description;
                divComentario.appendChild(comentarioElement);

                // Agregar la fecha si está disponible
                const dateElement = document.createElement('p');
                var options = { year: '2-digit', month: '2-digit', day: '2-digit' };
                dateElement.textContent = comentario.dateTime ? `Fecha: ${new Date(comentario.dateTime).toLocaleDateString("en-GB",options)}` : ""; // Usar la fecha de la API o un mensaje por defecto
                divComentario.appendChild(dateElement);


                ratingsContainer.appendChild(divComentario);
            });

            // Calcular el promedio de las calificaciones
            const averageScore = totalScore / numberOfRatings;
            renderAverageStars(averageScore);  // Mostrar las estrellas promedio
        })
        .catch(error => console.error('Error al cargar las calificaciones:', error));
}

// Función para renderizar las estrellas basadas en el promedio
function renderAverageStars(averageScore) {
    console.log('Average score:', averageScore);  // Para verificar el promedio de estrellas

    const starsContainer = document.getElementById('average-stars-container');
    starsContainer.innerHTML = '';  // Limpiar el contenedor antes de añadir nuevas estrellas

    const roundedAverage = Math.round(averageScore);  // Redondear el promedio

    // Crear las estrellas para el promedio
    for (let i = 0; i < 5; i++) {
        const estrella = document.createElement('span');
        estrella.classList.add('fa', 'fa-star');
        if (i < roundedAverage) {
            estrella.classList.add('checked');  // Estrella activa
        }
        starsContainer.appendChild(estrella);
    }
}



// Función para agregar una calificación al DOM
function addRatingToDOM(rating) {
    const ratingsContainer = document.getElementById('ratings');
    const divComentario = document.createElement('div');
    divComentario.classList.add('ratings-row');

    // Crear el nombre del usuario
    const userElement = document.createElement('h5');
    userElement.textContent = rating.user;
    divComentario.appendChild(userElement);

    
    // Crear las estrellas usando Font Awesome
    const calificacion = Math.round(rating.score);
    for (let i = 0; i < 5; i++) {
        const estrella = document.createElement('span');
        estrella.classList.add('fa', 'fa-star');
        if (i < calificacion) {
            estrella.classList.add('checked');
        }
        divComentario.appendChild(estrella);
    }

       // Crear el comentario
    const comentarioElement = document.createElement('p');
    comentarioElement.textContent = rating.description;
    divComentario.appendChild(comentarioElement);

    // Mostrar la fecha de la calificación
    const dateElement = document.createElement('p');
    console.log(rating);
    dateElement.textContent = `Fecha: ${rating.date}`; // Mostrar la fecha
    divComentario.appendChild(dateElement);

    // Insertar el comentario al contenedor de calificaciones
    ratingsContainer.appendChild(divComentario);
}

function loadLocalRatings() {
    const productID = localStorage.getItem("productID");
    const storedRatings = JSON.parse(localStorage.getItem(`ratings-${productID}`)) || [];

    storedRatings.forEach(rating => {
        // Si alguna calificación no tiene una fecha, agregar "Fecha no disponible"
        if (!rating.dateTime) {
            rating.dateTime = "Fecha no disponible"
        }
        addRatingToDOM(rating);  // Agregar cada calificación guardada en localStorage al DOM
    });
}

function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html"
}

function formatNumber(num) {
    return num.toLocaleString('es-ES');
}
