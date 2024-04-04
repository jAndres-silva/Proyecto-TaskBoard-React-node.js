//authController.js en el servidor

const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
const { promisify } = require('util');

// Procedimiento para registrarnos
exports.register = async (req, res) => {
    try {
        const name = req.body.name;
        const user = req.body.user;
        const pass = req.body.pass;
        let passHash = await bcryptjs.hash(pass, 8);

        conexion.query('INSERT INTO users SET ?', { user: user, name: name, pass: passHash }, (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Error al registrar el usuario" });
            } else {
                res.status(200).json({ success: true, message: "Usuario registrado exitosamente" });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al registrar el usuario" });
    }
};

exports.login = async (req, res) => {
    try {
        const user = req.body.user;
        const pass = req.body.pass;

        if (!user || !pass) {
            res.status(400).json({ success: false, message: "Ingrese un usuario y contraseña" });
        } else {
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: "Error al iniciar sesión" });
                } else if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.status(401).json({ success: false, message: "Usuario y/o contraseña incorrectos" });
                } else {
                    const id = results[0].id;
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    };

                    res.cookie('jwt', token, cookiesOptions);
                    res.status(200).json({ success: true, message: "Inicio de sesión exitoso", token: token, user: results[0] });
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error al iniciar sesión" });
    }
};

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: "Error al verificar autenticación" });
                } else if (results.length === 0) {
                    res.status(401).json({ success: false, message: "Usuario no autenticado" });
                } else {
                    req.user = results[0];
                    next();
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    } else {
        res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }
};
// manejo de cierre de sesion 
exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ success: true, message: "Sesión cerrada exitosamente" });
    
};

