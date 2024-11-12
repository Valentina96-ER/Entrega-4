document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Si el carrito está vacío, muestra un mensaje de alerta
    if (cart.length === 0) {
        document.querySelector("main").innerHTML = `
            <div class="text-center p-4">
                <h4 class="alert-heading">Tu carrito está vacío</h4>
                <a href="categories.html" class="btn btn-primary">Comienza tu compra</a>
            </div>`;
        updateCartCount(cart);
        return;
    }

    // Variables para los totales
    let totalUSD = 0;
    let totalUYU = 0;

    // Construir el HTML del carrito
    let cartHTML = `
    <div class="text-center p-4">
        <h2>Tus productos seleccionados</h2>
        <p class="lead">Revisá los artículos que elegiste. ¡Estás a un paso de completar tu compra!</p>
    </div>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>`;

    cart.forEach((product, index) => {
        let subtotal = product.cost * product.quantity;

        // Sumar al total correspondiente
        if (product.currency === 'USD') {
            totalUSD += subtotal;
        } else if (product.currency === 'UYU') {
            totalUYU += subtotal;
        }

        cartHTML += `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px;"> ${product.name}</td>
                <td>${product.currency} ${formatNumber(product.cost)}</td>
                <td><input type="number" id="quantity${index}" value="${product.quantity}" min="1" class="form-control"></td>
                <td id="subtotal${index}">${product.currency} ${formatNumber(subtotal)}</td>
                <td>
                    <button class="btn btn-danger" id="remove${index}">
                    <i class="fa fa-trash"></i></button></td>
            </tr>`;
    });

    cartHTML += `
            </tbody>
        </table>
        <div class="d-flex justify-content-between">
            <div>
              <a href="categories.html" class="btn btn-secondary">Seguir comprando</a>
              <button class="btn btn-primary" id="checkoutButton">Finalizar compra</button>  
            </div>
            <div>
                <p id="totalUSD" class="fw-light text-muted fs-5">Total en USD: $${formatNumber(totalUSD)}</p>
                <p id="totalUYU" class="fw-light text-muted fs-5">Total en UYU: $${formatNumber(totalUYU)}</p>
            </div>
        </div>
    </div>`;

    document.querySelector("main").innerHTML = cartHTML;

    // Función para eliminar un producto del carrito
    cart.forEach((product, index) => {
        document.getElementById(`remove${index}`).addEventListener("click", function () {
            cart.splice(index, 1);
            saveCartToLocalStorage(cart);
            renderCart();
        });

        // Evento para actualizar el subtotal y los totales cuando se cambia la cantidad
        document.getElementById(`quantity${index}`).addEventListener("input", function () {
            const newQuantity = parseInt(this.value);
            if (isNaN(newQuantity) || newQuantity < 1) return;

            const newSubtotal = product.cost * newQuantity;
            document.getElementById(`subtotal${index}`).innerText = `${product.currency} ${formatNumber(newSubtotal)}`;

            // Actualizar la cantidad en el producto y guardar en localStorage
            product.quantity = newQuantity;
            saveCartToLocalStorage(cart);

            // Actualizar los totales y el número de productos en el carrito
            updateTotals(cart);
            updateCartCount(cart);
        });
    });

    // Función para actualizar los totales
    function updateTotals(cart) {
        let totalUSD = 0;
        let totalUYU = 0;

        cart.forEach(product => {
            let subtotal = product.cost * product.quantity;

            if (product.currency === 'USD') {
                totalUSD += subtotal;
            } else if (product.currency === 'UYU') {
                totalUYU += subtotal;
            }
        });

        // Actualizar los totales en la interfaz
        document.getElementById("totalUSD").innerText = `Total en USD: $${formatNumber(totalUSD)}`;
        document.getElementById("totalUYU").innerText = `Total en UYU: $${formatNumber(totalUYU)}`;
    }

    // Función para actualizar el número de productos en el carrito
    function updateCartCount(cart) {
        let totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
        document.getElementById("cartCount").innerText = totalItems > 0 ? totalItems : 0;
        localStorage.setItem("cartCount", totalItems);
    }

    // Función para guardar el carrito en localStorage
    function saveCartToLocalStorage(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Función para renderizar el carrito
    function renderCart() {
        location.reload();
    }

    // Asignar evento al botón de checkout
    document.getElementById("checkoutButton").addEventListener("click", function () {
        showCheckoutModal();
    });
});

// Función para formatear números con separación de miles
function formatNumber(num) {
    return num.toLocaleString('es-ES', { minimumFractionDigits: 0, useGrouping: true });
}

// Función para mostrar el pop-up modal
function showCheckoutModal() {
    const modalHTML = `
    <div class="modal" id="checkoutModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Proceso de Pago</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Pestañas -->
                    <ul class="nav nav-tabs" id="checkoutTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="envio-tab" data-bs-toggle="tab" data-bs-target="#envio" type="button" role="tab">Envío</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="pago-tab" data-bs-toggle="tab" data-bs-target="#pago" type="button" role="tab">Forma de Pago</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="costos-tab" data-bs-toggle="tab" data-bs-target="#costos" type="button" role="tab">Costos</button>
                        </li>
                    </ul>
                    <div class="tab-content mt-3" id="checkoutTabsContent">
                        <div class="tab-pane fade show active" id="envio" role="tabpanel">
                            <p>Seleccione el tipo de envío y dirección de envío.</p>
                            <form id="envioForm">
                                <div class="mb-3">
                                    <label for="tipoEnvio" class="form-label">Tipo de Envío</label>
                                    <select class="form-select" id="tipoEnvio" required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="premium">Premium 2 a 5 días (15%)</option>
                                        <option value="express">Express 5 a 8 días (7%)</option>
                                        <option value="standard">Standard 12 a 15 días (5%)</option>
                                    </select>
                                </div>
                        <div class="mb-3">
                            <label for="departamento" class="form-label">Departamento</label>
                            <select class="form-select" id="departamento" required>
                                <option value="">Seleccione un departamento</option>
                                ${Object.keys(departamentosLocalidades).map(dep => `<option value="${dep}">${dep}</option>`).join("")}
                            </select>

                            <label for="localidad" class="form-label mt-3">Localidad</label>
                            <select class="form-select" id="localidad" required disabled>
                                <option value="">Seleccione una localidad</option>
                            </select>

                            <label for="calle" class="form-label mt-3">Calle</label>
                            <input type="text" class="form-control" id="calle" placeholder="Calle" required>

                            <label for="numero" class="form-label mt-3">Número</label>
                            <input type="text" class="form-control" id="numero" placeholder="Número" required>

                            <label for="esquina" class="form-label mt-3">Esquina</label>
                            <input type="text" class="form-control" id="esquina" placeholder="Esquina" required>
                        </div>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="pago" role="tabpanel">
                            <p>Seleccione su forma de pago preferida.</p>
                            <form id="pagoForm">
                                <div class="mb-3">
                                    <label for="formaPago" class="form-label">Forma de Pago</label>
                                    <select class="form-select" id="formaPago" required>
                                        <option value="">Seleccione una opción</option>
                                        <option value="tarjeta">Tarjeta de Débito/Crédito</option>
                                        <option value="transferencia">Transferencia Bancaria</option>
                                    </select>
                                </div>
                                <div id="tarjetaCampos" style="display: none;">
                                    <div class="mb-3" style="position: relative;">
                                        <label for="numeroTarjeta" class="form-label">Número de Tarjeta</label>
                                        <input type="text" class="form-control" id="numeroTarjeta" placeholder="1234 5678 9012 3456" maxlength="19" required>
                                        <small id="numeroTarjetaWarning" class="text-danger" style="display:none;">Solo se permiten números</small>
                                        <!-- Logo de la tarjeta -->
                                        <img id="logoTarjeta" src="" alt="" style="display: none; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 30px; height: auto;">
                                    </div>
                                    <div class="mb-3">
                                        <label for="nombreTitular" class="form-label">Nombre del Titular</label>
                                        <input type="text" class="form-control" id="nombreTitular" placeholder="Nombre como aparece en la tarjeta" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="fechaExpiracion" class="form-label">Fecha de Expiración</label>
                                        <input type="text" class="form-control" id="fechaExpiracion" placeholder="MM/AA" maxlength="5" required>
                                        <small id="fechaExpiracionWarning" class="text-danger" style="display:none;">Fecha inválida o ya expirada</small>
                                    </div>
                                    <div class="mb-3">
                                        <label for="codigoCVV" class="form-label">CVV</label>
                                        <input type="password" class="form-control" id="codigoCVV" placeholder="123" maxlength="3" required>
                                        <small id="codigoCVVWarning" class="text-danger" style="display:none;">Solo se permiten números</small>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="costos" role="tabpanel">
                            <p>Resumen de costos:</p>
                            <ul>
                                <li>Subtotal: <span id="subtotal">$0</span></li>
                                <li>Costo de envío: <span id="costoEnvio">$0</span></li>
                                <li>Total: <span id="total">$0</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="atrasPago" style="display: none;">Atrás</button>
                    <button type="button" class="btn btn-primary" id="siguienteEnvio">Siguiente</button>
                    <button type="button" class="btn btn-primary" id="atrasCostos" style="display: none;">Atrás</button>
                    <button type="button" class="btn btn-primary" id="siguientePago" style="display: none;">Siguiente</button>
                    <button type="button" class="btn btn-primary" id="finalizarCompra" style="display: none;" disabled>Confirmar Pago</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();

    // Mostrar campos de tarjeta de crédito/débito según la forma de pago seleccionada
    document.getElementById("formaPago").addEventListener("change", function() {
        const tarjetaCampos = document.getElementById("tarjetaCampos");
        tarjetaCampos.style.display = this.value === "tarjeta" ? "block" : "none";
    });

    // Formateo del número de tarjeta y validación de entrada
    document.getElementById('numeroTarjeta').addEventListener('input', function() {
        let numero = this.value.replace(/\D/g, ''); // Remover caracteres no numéricos
        numero = numero.substring(0, 16); // Limitar a 16 dígitos
        this.value = numero.replace(/(\d{4})(?=\d)/g, '$1 '); // Formatear en grupos de 4

        // Detectar el tipo de tarjeta
        const tipo = detectarTipoTarjeta(numero);
        if (tipo !== 'desconocida') {
            this.style.backgroundImage = `url('img/${tipo}.png')`; // Muestra el logo en el fondo del input
        } else {
            this.style.backgroundImage = 'none'; // Remueve el logo si el tipo no es reconocido
        }

        // Mostrar advertencia si se ingresan caracteres no numéricos (sin contar espacios)
        document.getElementById("numeroTarjetaWarning").style.display = /\D/.test(numero) ? "block" : "none";
    });
    
    // Función para detectar el tipo de tarjeta basado en los primeros dígitos
    function detectarTipoTarjeta(numero) {
        const patrones = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            diners: /^36/,
            discover: /^(6011|622(?:1[2-9]|[2-8]\d|9[01])|64[4-9]|65)/,
            jcb: /^(352[8-9]|35[3-8][0-9])/
        };
        for (const [marca, patron] of Object.entries(patrones)) {
            if (patron.test(numero)) {
                return marca;
            }
        }
        return 'desconocida';
    }
    
    // Validación de entrada de fecha de expiración
    document.getElementById('fechaExpiracion').addEventListener('input', function() {
        const soloNumeros = this.value.replace(/\D/g, '').replace(/^(\d{2})(\d{0,2})$/, '$1/$2');
        this.value = soloNumeros;
    
        const [mes, anio] = this.value.split('/').map(num => parseInt(num, 10));
        const fechaActual = new Date();
        const mesActual = fechaActual.getMonth() + 1;
        const anioActual = parseInt(fechaActual.getFullYear().toString().slice(-2), 10);
    
        document.getElementById("fechaExpiracionWarning").style.display =
            (mes < 1 || mes > 12 || anio < anioActual || (anio === anioActual && mes < mesActual))
                ? "block" : "none";
    });
    
    // Validación para el campo CVV, limitando a solo números y longitud de 3
    document.getElementById('codigoCVV').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 3); // Limitar a 3 dígitos numéricos
        document.getElementById("codigoCVVWarning").style.display = this.value.length < 3 ? "block" : "none";
    });
  
    // Evento para actualizar localidades al seleccionar un departamento
    document.getElementById("departamento").addEventListener("change", function() {
        const deptoSeleccionado = this.value;
        const localidadSelect = document.getElementById("localidad");
    
        // Limpiar y habilitar el select de localidades
        localidadSelect.innerHTML = "<option value=''>Seleccione una localidad</option>";
        localidadSelect.disabled = !deptoSeleccionado;
    
        if (deptoSeleccionado) {
            const localidades = departamentosLocalidades[deptoSeleccionado];
            localidades.forEach(localidad => {
                const option = document.createElement("option");
                option.value = localidad;
                option.textContent = localidad;
                localidadSelect.appendChild(option);
            });
            localidadSelect.disabled = false;
        }
    });

    // Botones de navegación
    document.getElementById("siguienteEnvio").addEventListener("click", function () {
        if (validarEnvio()) {
            mostrarTab("pago-tab");
            toggleBotones("siguientePago", "atrasPago");
        } else {
            alert("Por favor complete todos los campos de la sección de Envío antes de continuar.");
        }
    });

    document.getElementById("siguientePago").addEventListener("click", function () {
        if (validarPago()) {
            mostrarTab("costos-tab");
            toggleBotones("finalizarCompra", "atrasCostos");
            calcularCostos();
        } else {
            alert("Por favor complete todos los campos de la sección de Pago antes de continuar.");
        }
    });
 // Botones de "Atrás"
 document.getElementById("atrasPago").addEventListener("click", function () {
    mostrarTab("envio-tab");
    toggleBotones("siguienteEnvio");
});

document.getElementById("atrasCostos").addEventListener("click", function () {
    mostrarTab("pago-tab");
    toggleBotones("siguientePago", "atrasPago");
});

document.getElementById("finalizarCompra").addEventListener("click", function () {
    alert("Compra realizada con éxito.");
    document.getElementById("checkoutModal").remove();
});

// Función para cambiar la pestaña activa
function mostrarTab(tabId) {
    const tab = new bootstrap.Tab(document.getElementById(tabId));
    tab.show();
}

// Función para alternar botones en cada pestaña
function toggleBotones(botonMostrar, botonAtras) {
    document.getElementById("siguienteEnvio").style.display = botonMostrar === "siguienteEnvio" ? "inline-block" : "none";
    document.getElementById("siguientePago").style.display = botonMostrar === "siguientePago" ? "inline-block" : "none";
    document.getElementById("finalizarCompra").style.display = botonMostrar === "finalizarCompra" ? "inline-block" : "none";
    document.getElementById("atrasPago").style.display = botonAtras === "atrasPago" ? "inline-block" : "none";
    document.getElementById("atrasCostos").style.display = botonAtras === "atrasCostos" ? "inline-block" : "none";
}

// Validaciones
function validarEnvio() {
    return [...document.querySelectorAll('#envioForm [required]')].every(input => input.value.trim() !== '');
}

function validarPago() {
    return [...document.querySelectorAll('#pagoForm [required]')].every(input => input.value.trim() !== '');
}

function calcularCostos() {
    const subtotal = 100; // Este valor vendría de los productos del carrito
    const tipoEnvio = document.getElementById("tipoEnvio").value;
    let costoEnvio;

    if (tipoEnvio === "premium") {
        costoEnvio = subtotal * 0.15;
    } else if (tipoEnvio === "express") {
        costoEnvio = subtotal * 0.07;
    } else {
        costoEnvio = subtotal * 0.05;
    }

    const total = subtotal + costoEnvio;

    document.getElementById("subtotal").textContent = `$${subtotal}`;
    document.getElementById("costoEnvio").textContent = `$${costoEnvio.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}
}

const departamentosLocalidades = {
    "Artigas": ["Artigas", "Bella Union", "Pueblo Sequeira", "Topador", "Tomás Gomensoro", "Cuareim", "Baltasar Brum"],
    "Canelones": ["Ciudad de la Costa", "Las Piedras", "Pando", "Santa Lucía", "Canelones", "Atlántida", "Parque del Plata"],
    "Cerro Largo": ["Melo", "Fraile Muerto", "Río Branco", "Aceguá", "Isidoro Noblía", "Tupambaé"],
    "Colonia": ["Colonia del Sacramento", "Juan Lacaze", "Nueva Helvecia", "Nueva Palmira", "Tarariras", "Carmelo"],
    "Durazno": ["Durazno", "Sarandí del Yí", "Villa del Carmen", "Blanquillo"],
    "Flores": ["Trinidad", "Ismael Cortinas"],
    "Florida": ["Florida", "Sarandí Grande", "25 de Mayo", "Casupá", "Fray Marcos"],
    "Lavalleja": ["Minas", "José Pedro Varela", "Solís de Mataojo"],
    "Maldonado": ["Maldonado", "San Carlos", "Piriápolis", "Punta del Este", "Pan de Azúcar", "Aiguá", "Punta Ballena", "José Ignacio", "La Barra", "Manantiales", "Ocean Park", "Balneario Buenos Aires", "El Tesoro", "Garzón", "Gregorio Aznárez", "Bella Vista", "Solís", "Playa Hermosa", "Playa Verde", "La Capuera", "Chihuahua", "La Sonrisa"],
    "Montevideo": [
      "Ciudad Vieja", "Centro", "Barrio Sur", "Cordón", "Palermo", "Parque Rodó", "Punta Carretas", 
      "Pocitos", "Buceo", "La Unión", "La Blanqueada", "Parque Batlle", "Villa Dolores", "La Mondiola", "Malvín", 
      "Malvín Norte", "Punta Gorda", "Carrasco", "Carrasco Norte", "Tres Cruces", "La Comercial", "Villa Muñoz", 
      "Goes", "Aguada", "Reducto", "Arroyo Seco", "Bella Vista", "La Figurita", "Jacinto Vera", "Larrañaga", "Maroñas", 
      "Parque Guaraní", "Flor de Maroñas", "Villa Española", "Simón Bolívar", "Brazo Oriental", "Atahualpa", "Prado", 
      "Capurro", "Paso Molino", "Belvedere", "Sayago", "Paso de las Duranas", "Aires Puros", "Cerrito de la Victoria", 
      "Pérez Castellanos", "Ituzaingó", "La Cruz de Carrasco", "Bella Italia", "Punta de Rieles", "Nueva España", 
      "La Chancha", "Jardines del Hipódromo", "Piedras Blancas", "Marconi", "Plácido Ellauri", "Las Acacias", 
      "Casavalle", "Manga", "Lavalleja", "Peñarol", "Las Retamas", "Conciliación", "Nuevo París", 
      "La Teja / Pueblo Victoria", "Tres Ombúes", "El Tobogán", "Cerro Norte", "Villa del Cerro", "Casabó", 
      "Santa Catalina", "La Paloma Tomkinson", "Villa Colón", "Lezica", "Los Bulevares", "Paso de la Arena"
    ],
    "Paysandú": ["Paysandú", "Guichón", "Quebracho", "Piedras Coloradas", "Casa Blanca", "Pueblo Gallinal", "Termas de Almirón"],
    "Río Negro": ["Fray Bentos", "Young", "Nuevo Berlín", "San Javier", "Grecco", "Bellaco", "Menafra"],
    "Rivera": ["Rivera", "Tranqueras", "Vichadero", "Minas de Corrales", "Masoller"],
    "Rocha": ["Rocha", "Chuy", "Castillos", "Lascano", "La Paloma", "La Pedrera", "Cabo Polonio", "Barra de Valizas", "Punta del Diablo", "19 de Abril", "Velázquez", "San Luis al Medio"],
    "Salto": ["Salto", "Constitución", "Belén", "Pueblo Lavalleja", "Rincón de Valentín", "Colonia Itapebí", "Termas del Daymán"],
    "San José": ["San José de Mayo", "Libertad", "Ciudad del Plata", "Ecilda Paullier", "Raigón", "Rodríguez", "Kiyú-Ordeig"],
    "Soriano": ["Mercedes", "Dolores", "Cardona", "Palmitas", "Risso", "Santa Catalina", "José Enrique Rodó"],
    "Tacuarembó": ["Tacuarembó", "Paso de los Toros", "San Gregorio de Polanco", "Ansina", "Las Toscas de Caraguatá", "Achar", "Curtina"],
    "Treinta y Tres": ["Treinta y Tres", "Vergara", "Santa Clara de Olimar", "Villa Sara", "Rincón", "Charqueada", "Cerro Chato", "José Pedro Varela"]
  };
  
  

