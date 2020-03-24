const express = require('express');
const _ = require('underscore');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// ================================
// Buscar productos
// ================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'categoria')
        .exec((err, productos) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

// ================================
// Obtener todos los productos
// ================================
app.get('/productos', verificaToken, (req, res)=>{
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria')
        .exec((err, productos) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments((err, cuantos) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos
                });
            });
    });
});

// ================================
// Obtener un producto por id
// ================================
app.get('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    Producto.findById(id) 
        .populate('usuario', 'nombre email')
        .populate('categoria', 'categoria')
        .exec((err, productoDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID de producto incorrecto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ================================
// Crear un nuevo producto
// ================================
app.post('/productos', verificaToken, (req, res)=>{
    let body = req.body;
    let usuario = req.usuario;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario._id
    });

    producto.save((err, productoDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo crear el producto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });
    });
});

// ================================
// Actualizar un producto
// ================================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let usuario = req.usuario;
    let producto = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, producto, {new: true, runValidators: true}, (err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ================================
// Borrar un producto
// ================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambioEstado = {disponible: false};

    Producto.findByIdAndUpdate(id, cambioEstado, {new: true}, (err, productoBorrado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoBorrado){
            return res.json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: productoBorrado
        });
    });
});

module.exports = app;