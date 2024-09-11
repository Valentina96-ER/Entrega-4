document.addEventListener("DOMContentLoaded", function() {
  const catID = localStorage.getItem("catID");
  let products = [];

  if (catID) {
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
      .then(response => response.json())
      .then(data => {
        document.querySelector('.lead').textContent = `Verás aquí todos los productos de la categoría ${data.catName}.`;
        products = data.products;  // Guardar los productos en una variable para reutilizar
        console.log(products); // Verifica los productos
        showData(products);  // Mostrar los productos inicialmente
      })
      .catch(error => console.error('Error al cargar los productos:', error));
  } else {
    console.error('No se ha encontrado un catID en el almacenamiento local.');
  }

  // Filtro por rango de precio (cost)
  document.getElementById("rangeFilterCost").addEventListener("click", function() {
    let minCost = document.getElementById("rangeFilterCostMin").value;
    let maxCost = document.getElementById("rangeFilterCostMax").value;

    // Eliminar puntos de los separadores de miles y cambiar comas por puntos para manejar decimales
    const cleanInputValue = (value) => {
      return value.replace(/\./g, '').replace(/,/g, '.');  // Eliminar puntos de miles y cambiar comas por puntos decimales
    };

    minCost = minCost ? parseFloat(cleanInputValue(minCost)) : 0;
    maxCost = maxCost ? parseFloat(cleanInputValue(maxCost)) : Infinity;

    console.log("Min Cost: ", minCost, "Max Cost: ", maxCost); // Verifica los valores

    const filteredProducts = products.filter(product => product.cost >= minCost && product.cost <= maxCost);

    if (filteredProducts.length > 0) {
        showData(filteredProducts);
    } else {
        showData([]); // Mostrar un mensaje de "No hay productos" si no hay resultados
    }
});


  // Limpiar filtros de precio
  document.getElementById("clearRangeFilter").addEventListener("click", function() {
    document.getElementById("rangeFilterCostMin").value = '';
    document.getElementById("rangeFilterCostMax").value = '';
    showData(products);  // Volver a mostrar todos los productos
  });

  // Ordenar productos de A-Z
  document.getElementById("sortAsc").addEventListener("click", function() {
    const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));
    showData(sortedProducts);
  });

  // Ordenar productos de Z-A
  document.getElementById("sortDesc").addEventListener("click", function() {
    const sortedProducts = [...products].sort((a, b) => b.name.localeCompare(a.name));
    showData(sortedProducts);
  });

  // Ordenar por cantidad de vendidos (relevancia)
  document.getElementById("sortByCount").addEventListener("click", function() {
    const sortedProducts = [...products].sort((a, b) => b.soldCount - a.soldCount);
    showData(sortedProducts);
  });
});

// Función para mostrar datos de los productos
function showData(products) {
  const container = document.getElementById("container");
  container.innerHTML = ''; // Limpiar el contenedor antes de mostrar los nuevos productos
 
  if (products.length === 0) {
      // Verificar si el array original de productos también está vacío
      if (document.querySelector('.lead').textContent.includes("productos de la categoría")) {
          container.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
      } else {
          container.innerHTML = '<p>No hay productos que coincidan con los filtros seleccionados.</p>';
      }
  } else {
      products.forEach(product => {
          const formattedCost = formatNumber(product.cost);
          const productHTML = `
          <div onclick="setProductID(${product.id})" class="list-group-item list-group-item-action cursor-active">
            <div class="row mb-4 product">
              <div class="col-md-3">
                <img src="${product.image}" class="img-fluid" alt="${product.name}">
              </div>
              <div class="col-md-6">
                <h4><strong>${product.name}</strong></h4>
                <p>${product.description}</p>
                <p><span class="etPrecio">Precio:</span><span class="PrecioCompleto"> ${product.currency} ${formattedCost}</span></p>
              </div>
              <div class="col-md-3">
                <p><span class="etVendidos">Cantidad de vendidos:</span>${product.soldCount}</p>
              </div>
            </div>
          </div>`;
          container.innerHTML += productHTML;
      });
  }
}

// Función para formatear números con puntos cada tres dígitos
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "products-info.html"
}


