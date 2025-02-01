const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Ruta para la página principal
router.get('/', (req, res) => {
    res.render('home', { isAdmin: req.session.isAdmin });
});

// Registro de usuario
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { nombre, email, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
        nombre,
        email,
        password: hashedPassword,
        isAdmin: isAdmin === 'true'
    });

    try {
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
});

// Inicio de sesión
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;