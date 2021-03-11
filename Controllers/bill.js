'use strict'

var User = require('../Models/user');
var Product = require('../Models/product');
var Bill = require('../Models/bills');
const user = require('../Models/user');
var log = require('./../utils/logger');

var controller = {
    createBill: function (req, res) {
        var adminId = req.params.id;
        var params = req.body;
        var bill = new Bill();
        var user = new User();

        if (adminId != req.user.sub) {
            log.warn("No puedes realizar esta accion")
            res.status(404).send({
                message: "No puedes realizar esta accion"
            })
        } else {
            User.findById(adminId, (err, adminFind) => {
                if (err) {
                    log.error("Error al buscar al administrador", err)
                    res.send(500).send({
                        message: "Error al buscar el administrador"
                    })
                } else if (adminFind) {
                    Product.findOne({ name: params.product }, (err, productFind) => {
                        if (err) {
                            log.error("Error al buscar el producto", err)
                            res.status(500).send({
                                message: "Error al buscar el producto"
                            })
                        } else if (productFind) {
                            bill.date = new Date();
                            bill.totalProduct = params.totalProduct;
                            bill.totalPrice = params.totalProduct * productFind.price;
                            var stockActualizado = productFind.stock - params.totalProduct;

                            if(stockActualizado <= 0){
                                log.warn("Ya no tienes más de estos productos")
                                res.status(404).send({
                                    message: "Ya no tienes más de estos productos"
                                })
                            }else{
                                bill.save((err, billSaved) => {
                                    if (err) {
                                        log.error("No se ha podido guardar", err)
                                        res.status(500).send({
                                            message: "No se ha podido guardar"
                                        })
                                    } else if (billSaved) {
                                        User.findByIdAndUpdate(adminId, { $push: { bills: billSaved._id } }, { new: true }, (err, adminPush) => {
                                            if (err) {
                                                log.error("Error al actualizar al administrador", err)
                                                res.status(500).send({
                                                    message: "Error al actualizar al administrador"
                                                })
                                            } else if (adminPush) {
                                                Bill.findByIdAndUpdate(billSaved._id, { $push: { products: productFind._id } }, { new: true }, (err, productPush) => {
                                                    if (err) {
                                                        log.error("Error al actualizar la factura")
                                                        res.status(500).send({
                                                            message: "Error al actualizar la factura"
                                                        })
                                                    } else if (productPush) {
                                                        Product.findOneAndUpdate({name: params.product}, {$set:{stock: stockActualizado}}, {new: true}, (err, stockUpdated) => {
                                                            if(err){
                                                                log.error("Error al actualizar el producto", err)
                                                                res.status(500).send({
                                                                    message: "Error al actualizar el producto"
                                                                })
                                                            }else if(stockUpdated){
                                                                log.info("Factura creada")
                                                                res.send({
                                                                    message: "factura creada", productPush
                                                                })
                                                            }else{
                                                                log.warn("No existe ningun dato")
                                                                res.status(204).send({
                                                                    message: "No existe"
                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        log.warn("No existe ningun dato")
                                                        res.status(204).send({
                                                            message: "No existe"
                                                        })
                                                    }
                                                }).populate('products')
                                            } else {
                                                log.warn("No existe ningun dato")
                                                res.status(204).send({
                                                    message: "No existe"
                                                })
                                            }
                                        })
                                    } else {
                                        log.warn("No se pudo crear la factura")
                                        res.status(404).send({
                                            message: "No se pudo guardar la factura"
                                        })
                                    }
                                })
                            }
                        } else {
                            log.warn("No existe ningun dato")
                            res.status(204).send({
                                message: "No existe"
                            })
                        }
                    })
                }
            })
        }
    },
    getBillUser: function(req, res){
        let adminId = req.params.id;
        if(adminId != req.user.sub){
            log.warn("No tienes acceso a esta accion")
            res.status(404).send({
                message: "No tienes acceso a esta accion"
            })
        }else{
            User.find({}).populate('bills').exec((err, userFind) => {
                log.error("Error al buscar a los usuarios")
                if(err){
                    res.status(404).send({
                        message: "Error al buscar a los usuarios"
                    })
                }else if(userFind){
                    log.info("Usuario con sus facturas")
                    res.send({
                        message: "usuarios con sus facturas", userFind
                    })
                }else{
                    log.warn("No tiene ninguna factura")
                    res.status(204).send({
                        message: "No se encontro ningun dato"
                    })
                }
            })
        }
    },
    getSoldOut : function(req, res){
        let adminId = req.params.id;
        if(adminId != req.user.sub){
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "no tienes permisos para esta accion"
            })
        }else{
            Product.find({stock: {$eq : 0}}, (err, soldOutFind) => {
                log.error("Error al buscar los productos", err)
                if(err){
                    res.status(500).send({
                        message: "Error al buscar los productos"
                    })
                }else if(soldOutFind){
                    log.info("Productos agotados :D")
                    res.send({
                        message: "Estos son los productos agotados",
                        soldOutFind
                    })
                }else{
                    log.warn("No existe ningun dato");
                    res.status(204).send({
                        message: "No existe"
                    })
                }
            })
        }
    },
    getMoreSelled: function(req, res){
        let adminId = req.params.id;
        if(adminId != req.user.sub){
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "No tienes permisos para esta accion"
            })
        }else{
            Product.find({totalSale: {$gte : 50}}, (err, soldOutFind) => {
                if(err){
                    log.error("Error al buscar los productos")
                    res.status(500).send({
                        message: "Error al buscar los productos"
                    })
                }else if(soldOutFind){
                    log.info("Productos más vendidos encontrados :D")
                    res.send({
                        message: "Estos son los productos más vendidos",
                        soldOutFind
                    })
                }else{
                    log.warn("No se pudo realizar esta operacion")
                    res.status(404).send({
                        message: "No se pudo hacer la operacion"
                    })
                }
            })
        }
    }
}

module.exports = controller;