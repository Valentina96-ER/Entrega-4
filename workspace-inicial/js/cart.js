document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Si el carrito está vacío, muestra un mensaje de alerta
    if (cart.length === 0) {
        document.querySelector("main").innerHTML = `
            <div class="text-center p-4">
                <h4 class="alert-heading">Tu carrito está vacío</h4>
                <a href="categories.html" class="btn btn-primary">Comienza tu compra</a>
            </div>`;
        updateCartCount(cart); // Actualizar el número de productos en el carrito
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
            location.reload();
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

    // Actualizar el número de productos en el carrito
    updateCartCount(cart);

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
        let totalItems = cart.reduce((sum, product) => sum + product.quantity, 0); // Sumar todas las cantidades
        document.getElementById("cartCount").innerText = totalItems > 0 ? totalItems : 0; // Mostrar 0 si no hay productos
        localStorage.setItem("cartCount", totalItems); // Guardar el total en localStorage
    }

    // Función para guardar el carrito en localStorage
    function saveCartToLocalStorage(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    document.getElementById("checkoutButton").addEventListener("click", function () {
        alert("Funcionalidad de pago en desarrollo");
    });
});

// Función para formatear números con separación de miles
function formatNumber(num) {
    return num.toLocaleString('es-ES', { minimumFractionDigits: 0, useGrouping: true });
}
