const express = require('express');
const Turno = require('../models/turno');
const router = express.Router();

// Solicitar turno
router.post('/nuevo-turno', async (req, res) => {
    const { nombre, fecha } = req.body;
    const nuevoTurno = new Turno({ nombre, fecha });
    await nuevoTurno.save();
    res.redirect('/');
});

// Visualizar turnos
router.get('/', async (req, res) => {
    const turnos = await Turno.find();
    res.render('home', { turnos });
});

router.post('/actualizar-turno', async (req, res) => {
    const { id, estado } = req.body;
    await Turno.findByIdAndUpdate(id, { estado });
    res.redirect('/'); // Redirige a la página principal
});

router.get('/nuevo-turno', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirigir si no está autenticado
    }
    if (!req.session.isAdmin) {
        return res.status(403).send('No tienes permiso para acceder a esta página.'); // Prohibir acceso
    }
    res.render('nuevo-turno'); // Renderizar la vista para pedir turnos
});

module.exports = router;