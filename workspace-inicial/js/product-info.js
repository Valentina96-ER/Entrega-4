document.addEventListener("DOMContentLoaded", function () {
    const productID = localStorage.getItem("productID");
 
    if (productID) {
      fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
        .then(response => response.json())
        .then(data => {
          const product = data;  // Guardar el producto en una variable
          console.log(product); // Verificar los productos
          showData(product);  // Mostrar el producto
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
        <div class="container">
          <div class="row">
            <!-- Imagen grande del producto -->
            <div class="col-md-8 mb-4">
              <img src="${product.images[0]}" class="img-fluid w-100 rounded" alt="${product.name}">
            </div>
            <!-- Información del producto -->
            <div class="col-md-4">
              <h2><strong>${product.name}</strong></h2>
              <p>${product.description}</p>
              <h4>Precio: ${product.currency} ${formattedCost}</h4>
              <p>Cantidad de vendidos: ${product.soldCount}</p>
            </div>
          </div>
      
          <!-- Mosaico de imágenes adicionales -->
          <div class="row">
            ${product.images.slice(1, 4).map(image => `
              <div class="col-3 mb-2">
                <img src="${image}" class="img-fluid rounded" alt="${product.name}">
              </div>
            `).join('')}
          </div>
      
          <!-- Productos relacionados -->
          <div class="row mt-4">
            <h4 class="text-center">Productos relacionados</h4>
            ${product.relatedProducts.map(related => `
              <div class="col-6 text-center">
                <img src="${related.image}" class="img-fluid w-50" alt="${related.name}">
                <p>${related.name}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;     
        container.innerHTML += productInfoHTML;
    }
}

// Función para formatear el número con puntos
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
