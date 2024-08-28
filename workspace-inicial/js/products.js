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
            <p><span class="precioCompleto"><span class="etPrecio">Precio:</span> ${product.currency} ${formattedCost}</span></p>
          </div>
          <div class="col-md-3">
            <p><span class="etVendidos">Cantidad de vendidos:</span> <span class= "cantVend"> ${product.soldCount}</span></p>
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

document.addEventListener('DOMContentLoaded', function () {
  updateTextContent(); 
  window.addEventListener('resize', updateTextContent); 
});

function updateTextContent() {
  const VendidoEtiqueta = document.querySelectorAll('.etVendidos');
  const PrecioEtiqueta = document.querySelectorAll('.etPrecio');

  if (window.innerWidth <= 350) { 
      VendidoEtiqueta.forEach(label => label.textContent = 'Vendidos:'); 
      PrecioEtiqueta.forEach(label => label.style.display = 'none'); 
  } else {
      VendidoEtiqueta.forEach(label => label.textContent = 'Cantidad de vendidos:'); 
      PrecioEtiqueta.forEach(label => label.style.display = 'inline'); 
  }
}

