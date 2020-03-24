const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ================================
// Mostrar todas las categorias
// ================================
app.get('/categoria', verificaToken, (req, res)=>{
    Categoria.find({})
        .sort('categoria')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, cuantos) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos
                });
            });
    });
});

// ================================
// Mostrar una categoria por ID
// ================================
app.get('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID de categoria incorrecto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ================================
// Crear nueva categoria
// ================================
app.post('/categoria', verificaToken, (req, res)=>{
    let body = req.body;
    let usuario = req.usuario;
    let categoria = new Categoria({
        categoria: body.categoria,
        usuario: usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ================================
// Actualizar categoria
// ================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let categoria = req.body.categoria;

    Categoria.findByIdAndUpdate(id, {categoria: categoria}, {new: true, runValidators: true}, (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ================================
// Eliminar categoria
// ================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaBorrada){
            return res.json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;