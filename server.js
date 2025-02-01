const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const hbs = require('hbs');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');
const turnosRoutes = require('./routes/turnos');
const dbConfig = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Base de datos conectada'))
    .catch(err => console.error(err));

// Configuración de hbs
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbConfig.url })
}));

// Rutas
app.use('/', authRoutes);
app.use('/turnos', turnosRoutes);

// Servir archivos estáticos
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});