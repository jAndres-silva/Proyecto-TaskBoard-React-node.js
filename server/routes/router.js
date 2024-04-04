// router.js del servidor del proyecto de react

const conexion = require('../database/db');
const express = require('express');
const router = express.Router();
// Middleware de autenticación
const authController = require('../controllers/authController');

// Middleware de autenticación para el dashboard
router.get('/dashboard', authController.isAuthenticated, (req, res) => {
    // Redirigir al dashboard en el frontend
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Rutas para métodos del controlador - No necesitamos cambios aquí
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.isAuthenticated, authController.logout);
router.put('/api/users/:id', authController.isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, telefono, celular, direccion } = req.body;
  
      // Actualiza los datos del usuario en la base de datos
      const query = 'UPDATE users SET name = ?, email = ?, telefono = ?, celular = ?, direccion = ? WHERE id = ?';
      await conexion.query(query, [name, email, telefono, celular, direccion, userId]);
  
      res.status(200).json({ success: true, message: 'Datos actualizados correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al actualizar los datos' });
    }
  });


module.exports = router;

