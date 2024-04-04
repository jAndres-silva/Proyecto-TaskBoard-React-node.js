//app.js servidor

const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware para analizar datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para analizar cookies
app.use(cookieParser());

// Establecer las variables de entorno
dotenv.config({ path: './env/.env' });

app.use(cors());

// Rutas para el backend
app.use('/', require('./routes/router')); // Rutas para renderizar vistas

// Manejar rutas desconocidas - redirigir al archivo HTML principal del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Middleware para eliminar la caché en respuestas sin usuario autenticado
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  });

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
