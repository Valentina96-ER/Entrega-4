const express = require('express');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');  // Importar jsonwebtoken
const bodyParser = require('body-parser');  // Para parsear el body de las peticiones
const app = express();
const port = 3000;

const SECRET_KEY = 'mi_clave_secreta';  // Clave secreta para firmar el JWT

// Middleware para parsear el body en formato JSON
app.use(bodyParser.json());

// Aplicar CORS antes de las rutas
app.use(cors({
    origin: 'http://127.0.0.1:5501'  // Permitir solo solicitudes desde el frontend
}));

// Datos de usuarios (esto normalmente vendría de una base de datos)
const usuarios = [
    { username: "usuario1", password: "password1" },
    { username: "usuario2", password: "password2" }
];

// Middleware para validar el token
const validarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Obtener el token del header Authorization

    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado, no se proporcionó token' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }
        req.user = decoded;  // Guardar la información del usuario decodificada en la petición
        next();  // Continuar con la siguiente ruta
    });
};

// Aplicar el middleware para rutas protegidas
app.get('/cats_products/:catID', (req, res) => {
    // Acceso solo si el token es válido
    const categoriaId = req.params.catID;
    const categoria = leerJSON(`./data/cats_products/${categoriaId}.json`);

    if (categoria) {
        res.json(categoria);
    } else {
        res.status(404).json({ error: 'Categoría no encontrada' });
    }
});

// Ruta de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;  // Obtener las credenciales

    // Verificar las credenciales (aquí puedes adaptar esto a una base de datos)
    const usuario = usuarios.find(u => u.username === username && u.password === password);

    if (!usuario) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });  // Si no lo encuentra, devuelve error
    }

    // Crear un JWT con el nombre de usuario
    const token = jwt.sign({ username: usuario.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });  // Enviar el token al cliente
});


// Función para leer archivos JSON y devolver su contenido
const leerJSON = (ruta) => {
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log('Error al leer el archivo:', err);
        return null;
    }
};

// Ruta para obtener productos por categoría
app.get('/cats_products/:catID', (req, res) => {
    const categoriaId = req.params.catID;
    const categoria = leerJSON(`./data/cats_products/${categoriaId}.json`); // Ruta dinámica según el ID de la categoría

    if (categoria) {
        res.json(categoria);
    } else {
        res.status(404).json({ error: 'Categoría no encontrada' });
    }
});

// Ruta para obtener un producto específico por su ID
app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId;  // Obtener el ID del producto de la URL
    const productInfo = leerJSON(`./data/products/${productId}.json`);  // Ruta de comentarios según el ID del producto

    if (productInfo) {
        res.json(productInfo);  // Devolver los comentarios encontrados
    } else {
        res.status(404).json({ error: 'No se encontró información para este producto' });
    }
});

// Ruta para obtener el carrito de compras (carrito de usuario específico)
app.get('/user_cart', (req, res) => {
    const carrito = leerJSON('./data/user_cart/25801.json');  // Ruta de las categorías
    if (carrito) {
        res.json(carrito);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
    }
});

// Ruta para obtener la lista de categorías
app.get('/cats', (req, res) => {
    const categorias = leerJSON('./data/cats/cat.json');  // Ruta de las categorías
    if (categorias) {
        res.json(categorias);
    } else {
        res.status(404).json({ error: 'No se pudieron obtener las categorías' });
    }
});

// Ruta para obtener comentarios de productos específicos
app.get('/products_comments/:productId', (req, res) => {
    const productId = req.params.productId;  // Obtener el ID del producto de la URL
    const comentarios = leerJSON(`./data/products_comments/${productId}.json`);  // Ruta de comentarios según el ID del producto

    if (comentarios) {
        res.json(comentarios);  // Devolver los comentarios encontrados
    } else {
        res.status(404).json({ error: 'No se encontraron comentarios para este producto' });
    }
});

// Ruta para obtener las ventas
app.get('/sell', (req, res) => {
    const ventas = leerJSON('./data/sell/publish.json');  // Ruta para ventas
    if (ventas) {
        res.json(ventas);
    } else {
        res.status(404).json({ error: 'No se pudieron obtener las ventas' });
    }
});

// Ruta para la compra exitosa
app.get('/cart', (req, res) => {
    const mensaje = leerJSON('./data/cart/buy.json'); // Ruta de confirmación de compra
    if (mensaje) {
        res.json(mensaje);
    } else {
        res.status(500).json({ error: 'No se pudo obtener el mensaje de compra.' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
