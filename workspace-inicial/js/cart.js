document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Si el carrito está vacío, muestra un mensaje de alerta
    if (cart.length === 0) {
        document.querySelector("main").innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h4 class="alert-heading">Tu carrito está vacío</h4>
                <a href="categories.html" class="btn btn-primary">Seguir comprando</a>
            </div>`;
        return;
    }

    // Construir el HTML del carrito
    let cartHTML = `
    <div class="container">
        <h2>Tu Carrito de Compras</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>`;

    cart.forEach((product, index) => {
        cartHTML += `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px;"> ${product.name}</td>
                <td>${product.currency} ${product.cost}</td>
                <td><input type="number" id="quantity${index}" value="${product.quantity}" min="1" class="form-control"></td>
                <td id="subtotal${index}">${product.currency} ${product.cost * product.quantity}</td>
            </tr>`;
    });

    cartHTML += `
            </tbody>
        </table>
        <div class="d-flex justify-content-between">
            <button class="btn btn-primary" id="checkoutButton">Pagar</button>
            <a href="categories.html" class="btn btn-secondary">Seguir comprando</a>
        </div>
    </div>`;

    document.querySelector("main").innerHTML = cartHTML;

    // Agregar funcionalidad al botón de pago (opcional)
    document.getElementById("checkoutButton").addEventListener("click", function () {
        alert("Funcionalidad de pago en desarrollo");
    });

    // Evento para actualizar el subtotal y localStorage cuando se cambia la cantidad
    cart.forEach((product, index) => {
        document.getElementById(`quantity${index}`).addEventListener("input", function () {
            const newQuantity = parseInt(this.value);
            if (isNaN(newQuantity) || newQuantity < 1) return;

            const newSubtotal = product.cost * newQuantity;
            document.getElementById(`subtotal${index}`).innerText = `${product.currency} ${newSubtotal}`;

            // Actualizar la cantidad en el producto y guardar en localStorage
            product.quantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(cart));
        });
    });
});
