document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // If the cart is empty, show an alert message
    if (cart.length === 0) {
        document.querySelector("main").innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                <h4 class="alert-heading">Tu carrito está vacío</h4>
                <a href="categories.html" class="btn btn-primary">Seguir comprando</a>
            </div>`;
        updateCartCount(cart);
        return;
    }

    // Variables for totals
    let totalUSD = 0;
    let totalUYU = 0;

    // Build cart HTML
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

        // Add to the corresponding total
        if (product.currency === "USD") {
            totalUSD += subtotal;
        } else if (product.currency === "UYU") {
            totalUYU += subtotal;
        }

        cartHTML += `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px;"> ${product.name}</td>
                <td>${product.currency} ${formatNumber(product.cost)}</td>
                <td><input type="number" id="quantity${index}" value="${product.quantity}" min="1" class="form-control quantity-input" data-index="${index}"></td>
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

    // Event listener for removing items from the cart
    cart.forEach((product, index) => {
        document.getElementById(`remove${index}`).addEventListener("click", function () {
            cart.splice(index, 1);
            saveCartToLocalStorage(cart);
            location.reload(); // Reload page to update the cart display
        });

        // Event listener for updating quantity
        document.getElementById(`quantity${index}`).addEventListener("input", function () {
            const newQuantity = parseInt(this.value);
            if (isNaN(newQuantity) || newQuantity < 1) return;

            // Update quantity and save to localStorage
            product.quantity = newQuantity;
            saveCartToLocalStorage(cart);

            // Update subtotal and totals
            const newSubtotal = product.cost * newQuantity;
            document.getElementById(`subtotal${index}`).innerText = `${product.currency} ${formatNumber(newSubtotal)}`;

            // Update totals and cart count
            updateTotals(cart);
            updateCartCount(cart);

            // Trigger storage event to sync with sidebar
            window.dispatchEvent(new Event("storage"));
        });
    });

    // Update the cart count
    updateCartCount(cart);

    // Function to update the totals in the cart
    function updateTotals(cart) {
        let totalUSD = 0;
        let totalUYU = 0;

        cart.forEach(product => {
            let subtotal = product.cost * product.quantity;

            if (product.currency === "USD") {
                totalUSD += subtotal;
            } else if (product.currency === "UYU") {
                totalUYU += subtotal;
            }
        });

        // Update totals in the UI
        document.getElementById("totalUSD").innerText = `Total en USD: $${formatNumber(totalUSD)}`;
        document.getElementById("totalUYU").innerText = `Total en UYU: $${formatNumber(totalUYU)}`;
    }

    // Function to update the cart count
    function updateCartCount(cart) {
        const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
        document.getElementById("cartCount").innerText = totalItems > 0 ? totalItems : 0;
        localStorage.setItem("cartCount", totalItems);
    }

    // Function to save the cart to localStorage
    function saveCartToLocalStorage(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Event listener for the checkout button
    document.getElementById("checkoutButton").addEventListener("click", function () {
        alert("Funcionalidad de pago en desarrollo");
    });

    // Listen for storage changes from other tabs (e.g., sidebar in init.js)
    window.addEventListener("storage", function () {
        reloadCartQuantities();
    });

    // Function to reload quantities in real-time when updated in the sidebar
    function reloadCartQuantities() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Reload cart display with updated quantities and subtotals
        cart.forEach((product, index) => {
            const quantityInput = document.getElementById(`quantity${index}`);
            if (quantityInput) {
                quantityInput.value = product.quantity;
            }
            const subtotalElement = document.getElementById(`subtotal${index}`);
            if (subtotalElement) {
                const subtotal = product.cost * product.quantity;
                subtotalElement.innerText = `${product.currency} ${formatNumber(subtotal)}`;
            }
        });

        updateTotals(cart);
        updateCartCount(cart);
    }
});

// Function to format numbers with thousands separator
function formatNumber(num) {
    return num.toLocaleString("es-ES", { minimumFractionDigits: 0, useGrouping: true });
}
