-- Crear base de datos ecommerce
CREATE DATABASE ecommerce;

USE ecommerce;

-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Crear tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    category_id INT,
    sold_count INT,
    image VARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categorias(id)
);

-- Crear tabla de categorías
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Crear tabla de carrito
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_name VARCHAR(255) NOT NULL,
    product_cost DECIMAL(10, 2) NOT NULL,
    product_currency VARCHAR(10) NOT NULL,
    product_image VARCHAR(255),
    quantity INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

-- Crear tabla de comentarios
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    user_id INT,
    comment TEXT,
    score INT,
    date DATE,
    FOREIGN KEY (product_id) REFERENCES productos(id),
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);
