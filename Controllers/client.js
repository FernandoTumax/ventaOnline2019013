'use strict'

var User = require('../Models/user');
var Product = require('../Models/product');
var Category = require('../Models/category');
var Shopping = require('../Models/shoppingCars');
var Bill = require('../Models/bills');
var bcrypt = require('bcrypt-nodejs');
var log = require('./../utils/logger');

/* CLIENTES */

var controller = {
    registerClient: function (req, res) {
        let user = new User();
        var params = req.body;
        User.findOne({ username: params.username }, (err, userFind) => {
            if (err) {
                log.error("Error al buscar el usuario", err)
                res.status(500).send({
                    message: "Error al buscar el usuario"
                })
            } else if (userFind) {
                log.info("El usuario ya fue creado")
                res.send({
                    menssage: "El usuario ya fue creado"
                })
            } else {
                user.password = params.password;
                bcrypt.hash(user.password, null, null, (err, passwordHash) => {
                    if (err) {
                        log.error("Error al encriptar la contraseña", err)
                        res.status(500).send({
                            message: "Error al encriptar la contraseña"
                        })
                    } else if (passwordHash) {
                        user.username = params.username;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.rol = "ROL_CLIENT";
                        user.password = passwordHash;
                        user.save((err, clientSaved) => {
                            if (err) {
                                log.error("Error al crear al cliente", err)
                                res.status(500).send({
                                    message: "Error al crear al cliente"
                                })
                            } else if (clientSaved) {
                                log.info("El cliente fue creado :D")
                                res.send({
                                    message: "El cliente fue creado con exito",
                                    clientSaved
                                })
                            } else {
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
                })
            }
        })
    },
    getMoreSelled: function (req, res) {
        let clientId = req.params.id;

        if (clientId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "no tienes permisos para esta accion"
            })
        } else {
            Product.find({ totalSale: { $gte: 50 } }, (err, soldOutFind) => {
                if (err) {
                    log.error("Error al buscar los productos", err)
                    res.status(500).send({
                        message: "Error al buscar los productos"
                    })
                } else if (soldOutFind) {
                    log.info("Estos son los productos más vendidos")
                    res.send({
                        message: "Estos son los productos más vendidos",
                        soldOutFind
                    })
                } else {
                    log.warn("No existe ningun dato")
                    res.status(204).send({
                        message: "No existe"
                    })
                }
            })
        }
    },
    getProductByName: function (req, res) {
        let clientId = req.params.id;
        var params = req.body;
        if (clientId != req.user.sub) {
            log.warn("No tienes acceso a esta accion")
            res.status(404).send({
                message: "No tienes acceso a esta accion"
            })
        } else {
            Product.find({ name: params.product }, (err, productFind) => {
                if (err) {
                    log.error("Error al buscar los productos", err)
                    res.status(500).send({
                        message: "Error al buscar los productos"
                    })
                } else if (productFind) {
                    log.info("Productos encontrados")
                    res.send({
                        message: "Productos encontrados",
                        productFind
                    })
                } else {
                    log.warn("No existe ningun dato")
                    res.status(204).send({
                        message: "No existe"
                    })
                }
            })
        }
    },
    getCategorys: function (req, res) {
        let clientId = req.params.id;
        if (clientId != req.user.sub) {
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
    },
    getCategoryByName: function (req, res) {
        let clientId = req.params.id;
        var params = req.body;
        if (clientId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            Category.find({ name: params.category }, (err, categoryFind) => {
                if (err) {
                    log.error("Error al buscar por categoria", err)
                    res.status(404).send({
                        message: "Error al buscar por categoria"
                    })
                } else if (categoryFind) {
                    if (categoryFind.length <= 0) {
                        log.warn("No existe ningun categoria")
                        res.status(204).send({
                            message: "No existe"
                        })
                    } else {
                        log.info("Categoria encontrada")
                        res.send({
                            message: "Categoria encontrada",
                            categoryFind
                        })
                    }
                } else {
                    log.warn("No existe ningun dato")
                    res.status(204).send({
                        message: "No existe"
                    })
                }
            }).populate('products')
        }
    },
    setShoppingCar: function (req, res) {
        let clientId = req.params.id;
        var params = req.body;

        if (clientId != req.user.sub) {
            log.warn("No tienes acceso a esta accion")
            res.status(404).send({
                message: "No tienes acceso a esta accion"
            })
        } else {
            Product.findOne({ name: params.product }, (err, productFind) => {
                if (err) {
                    log.error("Error al buscar el producto", err)
                    res.status(500).send({
                        message: "Error al buscar el producto"
                    })
                } else if (productFind) {
                    User.findByIdAndUpdate(clientId, { $push: { shoppingCars: productFind._id } }, { new: true }, (err, clientUpdate) => {
                        if (err) {
                            log.error("Error al agregar al carrito", err)
                            res.status(500).send({
                                message: "Error al agregar al carrito"
                            })
                        } else if (clientUpdate) {
                            log.info("Agregado al carrito")
                            res.send({
                                message: "Agregado al carrito",
                                clientUpdate
                            })
                        } else {
                            log.warn("No existe ningun dato")
                            res.status(204).send({
                                message: "No existe ningun dato"
                            })
                        }
                    }).populate('shoppingCars')
                } else {
                    log.warn("No existe ningun dato")
                    res.status(204).send({
                        message: "No existe"
                    })
                }
            })
        }
    },
    setBill: function (req, res) {
        var clientId = req.params.idC;
        var productId = req.params.idP;
        var params = req.body;
        var bill = new Bill();
        var user = new User();

        if (clientId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "No puedes realizar esta accion"
            })
        } else {
            User.findById(clientId, (err, clientFind) => {
                if (err) {
                    log.error("Error al buscar al cliente", err)
                    res.send(500).send({
                        message: "Error al buscar al cliente"
                    })
                } else if (clientFind) {
                    Product.findOne({ _id: productId }, (err, productFind) => {
                        if (err) {
                            log.error("Error al buscar el producto", err)
                            res.status(500).send({
                                message: "Error al buscar el producto"
                            })
                        } else if (productFind) {
                            var products = clientFind.shoppingCars;
                            var contador;
                            var productList = [];

                            products.forEach(elemento => {
                                productList.push(elemento);

                            })
                            if (productList.length > 0) {
                                for (contador = 0; contador < productList.length; contador++) {
                                    if (productList[contador] == productId) {
                                        bill.date = new Date();
                                        bill.totalProduct = params.totalProduct;
                                        bill.totalPrice = params.totalProduct * productFind.price;
                                        var stockActualizado = productFind.stock - params.totalProduct;
                                        if (stockActualizado < 0) {
                                            log.warn("Ya no tienes más de estos productos")
                                            res.status(404).send({
                                                message: "Ya no tienes más de estos productos"
                                            })
                                        } else {
                                            bill.save((err, billSaved) => {
                                                if (err) {
                                                    log.error("Error al guardar", err)
                                                    res.status(500).send({
                                                        message: "No se ha podido guardar"
                                                    })
                                                } else if (billSaved) {
                                                    User.findByIdAndUpdate(clientId, { $push: { bills: billSaved._id } }, { new: true }, (err, clientPush) => {
                                                        if (err) {
                                                            log.error("Error al actualizar al cliente", err)
                                                            res.status(500).send({
                                                                message: "Error al actualizar al cliente"
                                                            })
                                                        } else if (clientPush) {
                                                            Bill.findByIdAndUpdate(billSaved._id, { $push: { products: productId } }, { new: true }, (err, productPush) => {
                                                                if (err) {
                                                                    log.error("Error al actualizar la factura", err)
                                                                    res.status(500).send({
                                                                        message: "Error al actualizar la factura"
                                                                    })
                                                                } else if (productPush) {
                                                                    Product.findOneAndUpdate({ _id: productId }, { $set: { stock: stockActualizado } }, { new: true }, (err, stockUpdated) => {
                                                                        if (err) {
                                                                            log.error("Error al actualizar el producto")
                                                                            res.status(500).send({
                                                                                message: "Error al actualizar el producto"
                                                                            })
                                                                        } else if (stockUpdated) {
                                                                            User.findOneAndUpdate({ _id: clientId, shoppingCars: stockUpdated._id }, { $pull: { shoppingCars: stockUpdated._id } }, { new: true }, (err, shoppingPull) => {
                                                                                if (err) {
                                                                                    log.error("Error al eliminar el producto del carrito")
                                                                                    res.status(500).send({
                                                                                        message: "Error al eliminar el producto del carrito"
                                                                                    })
                                                                                } else if (shoppingPull) {
                                                                                    log.info("Compra realizada :D")
                                                                                    res.send({
                                                                                        message: "Compra realizada", productPush
                                                                                    })
                                                                                } else {
                                                                                    log.warn("No existe el producto dentro del carrito")
                                                                                    res.status(204).send({
                                                                                        message: "No existe"
                                                                                    })
                                                                                }
                                                                            })
                                                                        } else {
                                                                            log.warn("No existe el producto")
                                                                            res.status(204).send({
                                                                                message: "No existe"
                                                                            })
                                                                        }
                                                                    })
                                                                } else {
                                                                    log.warn("No existe la factura")
                                                                    res.status(204).send({
                                                                        message: "No existe"
                                                                    })
                                                                }
                                                            }).populate('products')
                                                        } else {
                                                            log.warn("No existe el cliente")
                                                            res.status(204).send({
                                                                message: "No existe"
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    log.warn("No se pudo guardar la factura")
                                                    res.status(204).send({
                                                        message: "No se pudo guardar la factura"
                                                    })
                                                }
                                            })
                                            break;
                                        }
                                    } else {
                                        log.warn("No existe este producto en el carrito");
                                        res.status(404).send({
                                            message: "No existe este producto en el carrito"
                                        })
                                    }
                                }
                            } else {
                                log.warn("Su carrito esta vacio");
                                res.status(204).send({
                                    message: "Su carrito esta vacio"
                                })
                            }
                        } else {
                            log.warn("No existe el usuario")
                            res.status(204).send({
                                message: "No existe"
                            })
                        }
                    })
                }
            })
        }
    },
    editClient: function (req, res) {
        let clientId = req.params.id;
        let update = req.body;

        if (clientId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(500).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            User.findOne({ username: update.username }, (err, userFind) => {
                if (err) {
                    log.error("Error al modificar al cliente", err)
                    res.status(500).send({
                        message: "Error al modificar al usuario"
                    })
                } else if (userFind) {
                    log.info("Este nombre ya existe :D")
                    res.send({
                        message: "Este nombre de usuario ya existe"
                    })
                } else {
                    if (update.password) {
                        log.warn("No se puede modificar este campo")
                        res.status(404).send({
                            message: "No se puede modificar este campo"
                        })
                    } else {
                        User.findByIdAndUpdate(clientId, update, { new: true }, (err, clientUpdated) => {
                            if (err) {
                                log.error("Error general al actualizar")
                                res.status(500).send({
                                    message: "Error general al actualizar"
                                })
                            } else if (clientUpdated) {
                                log.info("Usuario actualizado :D")
                                res.send({
                                    message: "Usuario actualizado", clientUpdated
                                })
                            } else {
                                log.warn("No se pudo actualizar el usuario")
                                res.status(404).send({
                                    message: "No se pudo actualizar al usuario"
                                })
                            }
                        })
                    }
                }
            })
        }
    },
    removeClient: function (req, res) {
        let clientId = req.params.id;

        if (clientId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(500).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            User.findByIdAndRemove(clientId, (err, clientRemoved) => {
                if (err) {
                    log.error("Error al eliminar el cliente", err)
                    res.status(500).send({
                        message: "Error al eliminar el cliente"
                    })
                } else if (clientRemoved) {
                    log.info("Cliente eliminado")
                    res.send({
                        message: "Cliente eliminado",
                        clientRemoved
                    })
                } else {
                    log.warn("No existe ningun usuario")
                    res.status(204).send({
                        message: "No existe"
                    })
                }
            })
        }
    },
    getClient: function (req, res) {
        var clientId = req.params.id;

        if (clientId != req.user.sub) {
            log.warn("No tienes permisos para esta accion")
            res.status(404).send({
                message: "No tienes permisos para esta accion"
            })
        } else {
            User.findById(clientId, (err, userFind) => {
                if (err) {
                    res.status(500).send({
                        message: "Error general"
                    })
                } else if (userFind) {
                    res.send({
                        message: "Cliente encontrado", userFind
                    })
                }
            }).populate('shoppingCars').populate('bills')
        }
    }
}

module.exports = controller;