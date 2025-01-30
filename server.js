const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de express-hbs
app.engine('hbs', hbs.express4({
    extname: '.hbs',
    defaultLayout: __dirname + '/views/layouts/main.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Middleware para servir archivos estáticos y parsear el cuerpo de las solicitudes
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Simulación de base de datos
let turnos = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

// Ruta principal
app.get('/', (req, res) => {
    res.render('home', { turnos });
});

// Ruta para agregar un nuevo turno
app.post('/nuevo-turno', (req, res) => {
    const nuevoTurno = { id: Date.now(), estado: 'En Espera', ...req.body };
    turnos.push(nuevoTurno);
    fs.writeFileSync('db.json', JSON.stringify(turnos, null, 2));
    res.redirect('/');
});

// Ruta para actualizar el estado de un turno
app.post('/actualizar-turno', (req, res) => {
    const { id, estado } = req.body;
    turnos = turnos.map(turno => turno.id == id ? { ...turno, estado } : turno);
    fs.writeFileSync('db.json', JSON.stringify(turnos, null, 2));
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});