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
              <button class="btn btn-primary" id="checkoutButton">Pagar</button>  
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
                            <form>
                                <div class="mb-3">
                                    <label for="tipoEnvio" class="form-label">Tipo de Envío</label>
                                    <select class="form-select" id="tipoEnvio">
                                        <option value="premium">Premium 2 a 5 días (15%)</option>
                                        <option value="express">Express 5 a 8 días (7%)</option>
                                        <option value="standard">Standard 12 a 15 días (5%)</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="direccionEnvio" class="form-label">Dirección de Envío</label>
                                    <input type="text" class="form-control mb-2" id="departamento" placeholder="Departamento">
                                    <input type="text" class="form-control mb-2" id="localidad" placeholder="Localidad">
                                    <input type="text" class="form-control mb-2" id="calle" placeholder="Calle">
                                    <input type="text" class="form-control mb-2" id="numero" placeholder="Número">
                                    <input type="text" class="form-control" id="esquina" placeholder="Esquina">
                                </div>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="pago" role="tabpanel">
                            <p>Seleccione su forma de pago preferida.</p>
                            <form>
                                <div class="mb-3">
                                    <label for="formaPago" class="form-label">Forma de Pago</label>
                                    <select class="form-select" id="formaPago">
                                        <option value="tarjeta">Tarjeta de Crédito</option>
                                        <option value="transferencia">Transferencia Bancaria</option>
                                    </select>
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
                    <button type="button" class="btn btn-primary" id="finalizarCompra">Confirmar Pago</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Mostrar el modal
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();

    // Asignar eventos para los botones de la lógica de pestañas y cálculo de costos
    document.getElementById("finalizarCompra").addEventListener("click", function() {
        alert("Compra finalizada.");
        document.getElementById("checkoutModal").remove();
    });

    document.getElementById("tipoEnvio").addEventListener("change", calcularCostos);

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

// Asignar evento al botón de checkout
document.getElementById("checkoutButton").addEventListener("click", function () {
    showCheckoutModal();
});



