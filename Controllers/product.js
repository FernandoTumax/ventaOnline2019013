'use strict'


var Product = require('../Models/product');
var Category = require('../Models/category');
const user = require('../Models/user');
var log = require('./../utils/logger');

var controller = {
    createProduct: function (req, res) {
        var product = new Product();
        var adminId = req.params.id;
        var params = req.body;

        if (adminId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            return res.status(404).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            Category.findOne({ name: params.category }, (err, categoryFind) => {
                if (err) {
                    log.error("Error general al buscar la categoria");
                    return res.status(500).send({
                        message: "Error general al buscar la categoria"
                    })
                } else if (categoryFind) {
                    product.name = params.name;
                    product.description = params.description;
                    product.stock = params.stock;
                    product.price = params.price;
                    product.totalSale = 0;

                    product.save((err, productSaved) => {
                        if (err) {
                            log.error("Error al guardar los productos", err);
                            return res.status(500).send({
                                message: "Error al guardar los productos"
                            })
                        } else if (productSaved) {
                            Category.findOneAndUpdate({ name: params.category }, { $push: { products: productSaved._id } }, { new: true }, (err, productPush) => {
                                if (err) {
                                    log.error("Error al registrar el producto en la categoria");
                                    return res.status(500).send({
                                        message: "Error al registrar el producto en la categoria"
                                    })
                                } else if (productPush) {
                                    log.info("Producto agregado :D")
                                    return res.send({
                                        message: "Producto agregado", productSaved
                                    })
                                } else {
                                    log.warn("No se pudo agregar el producto")
                                    return res.status(404).send({
                                        message: "Error al agregar el producto"
                                    })
                                }
                            })
                        } else {
                            log.warn("No se guardó el producto")
                            return res.status(404).send({
                                message: 'No se guardó el producto'
                            })
                        }
                    })
                } else {
                    log.warn("El usuario al que deseas agregar el contacto no existe.")
                    return res.status(404).send({
                        message: 'El usuario al que deseas agregar el contacto no existe.'
                    })
                }
            })
        }
    },
    updateProduct: function (req, res) {
        let productId = req.params.idP;
        let adminId = req.params.idA;
        let categoryId = req.params.idC;
        let update = req.body;

        if (adminId != req.user.sub) {
            log.warn("No tienes permisos para realizar esta accion")
            return res.status(404).send({
                message: "no tienes permisos para realizar esta accion"
            })
        } else {
            Product.findById(productId, (err, productFind) => {
                if (err) {
                    log.error("Error al buscar el producto", err)
                    return res.status(500).send({
                        message: "Error al buscar el producto"
                    })
                } else if (productFind) {
                    Category.findOne({ _id: categoryId, products: productId }, (err, categoryFind) => {
                        if (err) {
                            log.error("Error general al buscar en la categoria")
                            return res.status(500).send({
                                message: "Error general al buscar en la categoria"
                            })
                        } else if (categoryFind) {
                            Product.findByIdAndUpdate(productId, update, { new: true }, (err, productUpdate) => {
                                if (err) {
                                    log.error("Error general al actualizar")
                                    return res.status(500).send({
                                        message: "Error general al actualizar"
                                    })
                                } else if (productUpdate) {
                                    log.info("Producto actualizado")
                                    return res.send({
                                        message: "Producto actualizado", productUpdate
                                    })
                                } else {
                                    log.warn("No se a podido actualizar")
                                    return res.status(404).send({
                                        message: "No se a podido actualizar"
                                    })
                                }
                            })
                        } else {
                            log.warn("No existe este producto")
                            return res.status(404).send({
                                message: "No existe este producto"
                            })
                        }
                    })
                } else {
                    log.warn("No coinciden")
                    return res.status(404).send({
                        message: "No coinciden"
                    })
                }
            })
        }
    },
    removeProduct: function (req, res) {
        let adminId = req.params.idA;
        let categoryId = req.params.idC;
        let productId = req.params.idP;
        if (adminId != req.user.sub) {
            log.error("No tienes permisos para esta accion")
            return res.status(500).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            Category.findOneAndUpdate({ _id: categoryId, products: productId }, { $pull: { products: productId } }, { new: true }, (err, productPull) => {
                if (err) {
                    log.error("Error general al buscar la categoria", err)
                    return res.status(500).send({
                        message: "Error general al buscar la categoria"
                    })
                } else if (productPull) {
                    Product.findByIdAndRemove(productId, (err, productRemove) => {
                        if (err) {
                            log.error("No se a podido eliminar el producto", err)
                            res.status(500).send({
                                message: "No se a podido eliminar el producto"
                            })
                        } else if (productRemove) {
                            log.info("Producto eliminado")
                            res.send({
                                message: "Producto eliminado", productRemove
                            })
                        } else {
                            log.warn("El producto ya fue eliminado o no existe")
                            res.status(404).send({
                                message: "El producto ya fue eliminado o no existe"
                            })
                        }
                    })
                } else {
                    log.warn("No se pudo eliminar el producto de la categoria")
                    return res.status(404).send({
                        message: "No se pudo eliminar el producto de la categoria"
                    })
                }
            })
        }
    },
    getProducts: function (req, res) {
        let adminId = req.params.id;

        if (adminId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            Product.find({}).exec((err, productFind) => {
                if (err) {
                    log.error("Error en el servidor", err)
                    return res.status(500).send({
                        message: "Error en el servidor"
                    })
                } else if (productFind) {
                    log.info("Productos encontrados")
                    return res.send({
                        message: "Productos encontrados", productFind
                    })
                } else {
                    log.warn("No se encontro ningun dato")
                    return res.status(204).send({})
                }
            })
        }
    },
    getProduct: function (req, res) {
        let adminId = req.params.idA;
        let productId = req.params.idP;

        Product.findById(productId).exec((err, productFind) => {
            if (err) {
                log.error("Error general cuando se busco el producto", err)
                res.status(500).send({
                    message: "Error general cuando se busco el producto"
                })
            } else if (productFind) {
                if (productFind.stock === 0) {
                    log.info("Producto sin stock")
                    res.send({
                        message: "Producto encontrado", productFind,
                        message: "El stock es de 0, tiene que comprar más"
                    })
                } else {
                    log.info("Productos encontrados")
                    res.send({
                        message: "Producto encontrado", productFind,
                        message: `El stock es de ${productFind.stock}`
                    })
                }
            } else {
                log.warn("No se encontro ningun dato")
                res.status(204).send({})
            }
        })
    }
}


module.exports = controller;