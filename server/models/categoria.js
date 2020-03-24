const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    categoria:{
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoria es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        required: [true, 'El usuario es requerido'],
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Categoria', categoriaSchema);