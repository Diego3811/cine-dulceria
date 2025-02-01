const mongoose = require('mongoose');

const TurnoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    estado: { type: String, default: 'En Espera' },
    fecha: { type: Date, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Turno', TurnoSchema);