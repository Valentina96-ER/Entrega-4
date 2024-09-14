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
      `;     
        container.innerHTML += productInfoHTML;
    }
}

// Función para formatear el número con puntos
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html"
}