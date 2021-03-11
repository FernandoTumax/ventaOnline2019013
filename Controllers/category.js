'use strict'

var Category = require('../Models/category');
const user = require('../Models/user');
var log = require('./../utils/logger');

var controller = {
    createCategory: function (req, res) {
        var category = new Category();
        let adminId = req.params.id;
        var params = req.body;

        if (adminId != req.user.sub) {
            log.warn("No tienes permiso para esta accion")
            res.status(404).send({
                message: "No tienes permiso para esta accion"
            })
        } else {
            Category.findOne({ name: params.name }, (err, categoryFind) => {
                if (err) {
                    log.error("Error en el servidor", err)
                    res.status(500).send({
                        message: "Error en el servidor", err
                    })
                } else if (categoryFind) {
                    log.info("Ya existe esta categoria")
                    res.send({
                        message: "ya existe esta categoria", categoryFind
                    })
                } else {
                    category.name = params.name;
                    category.description = params.description;

                    category.save((err, categorySaved) => {
                        if (err) {
                            log.error("Error al guardar la categoria", err)
                            res.status(500).send({
                                message: "Error al guardar la categoria"
                            })
                        } else if (categorySaved) {
                            log.info("Categoria creada")
                            res.send({
                                message: "Categoria creada", categorySaved
                            })
                        } else {
                            log.warn("No se encontro ningun dato")
                            res.status(204).send({})
                        }
                    })
                }
            })
        }
    },
    updateCategory: function (req, res) {
        let adminId = req.params.idA;
        let categoryId = req.params.idC;
        let update = req.body;

        if (adminId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            Category.findOne({ name: update.name }, (err, categoryFind) => {
                if (err) {
                    log.error("Error general al buscar la categoria")
                    res.status(500).send({
                        message: "Error general al buscar la categoria"
                    })
                } else if (categoryFind) {
                    log.info("No se pudo modificar, nombre ya en uso")
                    res.send({
                        message: "No se pude modificar, nombre ya en uso", categoryFind
                    })
                } else {
                    Category.findByIdAndUpdate(categoryId, update, { new: true }, (err, categoryUpdated) => {
                        if (err) {
                            log.error("Error al actualizar la categoria")
                            res.status(500).send({
                                message: "Error al actualizar la categoria"
                            })
                        } else if (categoryUpdated) {
                            log.info("Categoria actualizada")
                            res.send({
                                message: "Categoria actualizada", categoryUpdated
                            })
                        } else {
                            log.warn("No se puede actualizar esta categoria")
                            res.status(404).send({
                                message: "No se puede actualizar esta categoria"
                            })
                        }
                    })
                }
            })
        }
    },
    removeCategory: function (req, res) {
        let adminId = req.params.idA;
        let categoryId = req.params.idC;

        if (adminId != req.user.sub) {
            log.error("No tienes permisos para esta accion")
            res.status(404).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            Category.findOne({ _id: categoryId }, (err, categoryFind) => {
                if (err) {
                    log.error("Error general al eliminar")
                    return res.status(500).send({
                        message: "Error general al eliminar"
                    })
                } else if (categoryFind) {
                    if (categoryFind.name === "Default") {
                        log.warn("Esta categoria no se puede eliminar por que es la default")
                        res.status(404).send({
                            message: "Esta categoria no se puede eliminar"
                        })
                    } else {
                        let products = categoryFind.products;

                        let listProducts = [];

                        products.forEach(elemento => {
                            listProducts.push(elemento);
                        })
                        Category.findOneAndUpdate({ name: "Default" }, { $push: { products: listProducts } }, { new: true }, (err, productsPush) => {
                            if (err) {
                                log.error("Error al registrar el producto en la categoria")
                                return res.status(500).send({
                                    message: "Error al registrar el producto en la categoria"
                                })
                            } else if (productsPush) {
                                Category.findByIdAndRemove(categoryId, (err, categoryRemoved) => {
                                    if (err) {
                                        log.error("Error al eliminar la categoria")
                                        res.status(500).send({
                                            message: "Error al eliminar la categoria"
                                        })
                                    } else if (categoryRemoved) {
                                        log.info("Categoria eliminada con exito :D")
                                        res.send({
                                            message: "Categoria eliminada, todos sus productos pasaron a la categoria default", categoryRemoved
                                        })
                                    } else {
                                        log.warn("No se encontro ningun dato")
                                        res.status(204).send({})
                                    }
                                })
                            } else {
                                log.warn("Error al agregar el producto")
                                return res.status(404).send({
                                    message: "Error al agregar el producto"
                                })
                            }
                        })

                    }
                } else {
                    log.warn("No se encontro ningun dato")
                    return res.status(204).send({})
                }
            })
        }
    },
    getCategorys: function (req, res) {
        let adminId = req.params.id;
        if (adminId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            Category.find({}).populate('products').exec((err, categoryFind) => {
                if (err) {
                    log.error("Error al buscar las categorias")
                    res.status(500).send({
                        message: "Error al buscar las categorias"
                    })
                } else if (categoryFind) {
                    log.info("Categorias encontradas")
                    res.send({
                        message: "Categorias encontradas", categoryFind
                    })
                } else {
                    log.warn("No existe ningun dato")
                    res.status(204).send({
                        message: "No existe"
                    })
                }
            })
        }
    }
}

module.exports = controller;