<<<<<<< Updated upstream
=======
document.addEventListener("DOMContentLoaded", function() {
    // Carga de productos desde la API
    fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
      .then(response => response.json())
      .then(data => showData(data.products))
      .catch(error => console.error('Error al cargar los productos:', error));
});


// Función para mostrar datos de los productos
// Código implementado por Sofía, con pequeñas modificaciones para integración
function showData(products) {
    const container = document.getElementById("container"); // Usando el ID "container" para coherencia con el diseño existente
    container.innerHTML = ''; // Se limpia el contenido anterior para asegurar que no hay duplicados al recargar
    products.forEach(product => {
      const formattedCost = formatNumber(product.cost); // Formateo del costo incluido para mejorar la legibilidad
      const productHTML = `
        <div class="row mb-4 product">
          <div class="col-md-3">
            <img src="${product.image}" class="img-fluid" alt="${product.name}">
          </div>
          <div class="col-md-6">
            <h4><strong>${product.name}</strong></h4>
            <p>${product.description}</p>
            <p>Precio: ${product.currency} ${formattedCost}</p>
          </div>
          <div class="col-md-3">
            <p>Cantidad de vendidos: ${product.soldCount}</p>
          </div>
        </div>`;
      container.innerHTML += productHTML; // Agregar el producto al contenedor
    });
}


// Función para formatear números con puntos cada tres dígitos
// Código realizado por el equipo para mejorar la presentación de precios
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
>>>>>>> Stashed changes
