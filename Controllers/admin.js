'use strict'

var User = require('../Models/user');
var Product = require('../Models/product');
var Category = require('../Models/category');
var Bill = require('../Models/bills');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
const user = require('../Models/user');
var log = require('./../utils/logger');
const { error } = require('./../utils/logger');

var controller = {
    prueba: function (req, res) {
        res.status(200).send({
            message: "Ejecutandose correctamente"
        })
    },
    /* METODOS POR DEFAULT */
    createInit: function (req, res) {
        let user = User();
        User.findOne({ username: 'Admin' }, (err, adminFind) => {
            if (err) {
                log.error("Error al cargar al administrador")
            } else if (adminFind) {
                log.info("El administrador ya fue creado")
            } else {
                user.password = "12345";
                bcrypt.hash(user.password, null, null, (err, passwordHash) => {
                    if (err) {
                        log.error("Error al descriptar la contraseña")
                    } else if (passwordHash) {
                        user.username = "Admin";
                        user.name = "Josue Fernando";
                        user.lastname = "Tumax Baquiax";
                        user.rol = "ROL_ADMIN";
                        user.password = passwordHash;

                        user.save((err, adminSave) => {
                            if (err) {
                                log.error("Error al guardar al administrador")
                            } else if (adminSave) {
                                log.info("El administrador fue creado con exito");
                            } else {
                                log.warn("El administrador no fue creado");
                            }
                        })
                    }
                })
            }
        })
    },
    categoryDefault: function (req, res) {
        let category = new Category();
        Category.findOne({ name: 'Default' }, (err, categoryFind) => {
            if (err) {
                log.error("Error al cargar la categoria por defecto");
            } else if (categoryFind) {
                log.info("Categoria por defecto ya creada")
            } else {
                category.name = "Default";
                category.description = "Categoria donde se encontraran todos los productos sin categorias";
                category.save((err, categorySaved) => {
                    if (err) {
                        log.error("Error al crear la categoria por defecto");
                    } else if (categorySaved) {
                        log.info("La categoria fue creada con exito");
                    } else {
                        log.warn("La categoria no fue creada")
                    }
                })
            }
        })
    },
    /* GESTION DE USUARIOS */
    createUser: function (req, res) {
        let adminId = req.params.id;
        var params = req.body;
        let user = new User();

        if (adminId != req.user.sub) {
            log.warn("No tienes acceso a esta accion")
            res.status(404).send({
                message: "No tienes acceso a esta accion"
            })
        } else {
            User.findOne({ username: params.username }, (err, userFind) => {
                if (err) {
                    log.error("Error en el servidor", err)
                    res.status(500).send({
                        message: "Error en el servidor"
                    })
                } else if (userFind) {
                    log.info("Ya existe este usuario")
                    res.send({
                        message: "ya existe este usuario", userFind
                    })
                } else {
                    bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                        if (err) {
                            log.error("Error al encriptar la contraseña", err)
                            res.status(500).send({
                                message: "Error al encriptar la contraseña", err
                            })
                        } else if (passwordHash) {
                            user.password = passwordHash;
                            user.username = params.username;
                            user.name = params.name;
                            user.lastname = params.lastname;
                            user.rol = params.rol;

                            user.save((err, userSaved) => {
                                if (err) {
                                    log.error("Error al guardar los datos", err)
                                    res.status(500).send({
                                        message: "Error al guardar los datos"
                                    })
                                } else if (userSaved) {
                                    log.info("Usuario guardado")
                                    res.send({
                                        message: "Usuario guardado", userSaved
                                    })
                                } else {
                                    log.warn("No existe ningun dato")
                                    res.status(204).send({
                                        message: "No existe"
                                    })
                                }
                            })
                        } else {
                            log.warn("Contraseña no encriptada")
                            res.status(404).send({
                                message: "Contraseña no encriptada"
                            })
                        }
                    })
                }
            })
        }
    },
    updateUser: function (req, res) {
        let adminId = req.params.idA;
        let userId = req.params.idU;
        let update = req.body;

        if (adminId != req.params.idA) {
            log.warn("No tienes acceso a esta accion")
            res.status(404).send({
                message: "No tienes acceso a esta accion"
            })
        } else {
            User.findOne({ _id: userId }, (err, userFind) => {
                console.log(userFind)
                if(userFind.rol === "ROL_ADMIN"){
                    log.warn("No se puede modificar este usuario por que tiene rol administrador")
                    res.status(404).send({
                        message: "No se puede modificar este usuario por que es rol administrador"
                    })
                }else{
                    if (err) {
                        log.warn("Error al modificar al usuario", err)
                        res.status(500).send({
                            message: "Error al modificar al usuario"
                        })
                    } else if (userFind) {
                        if(update.password){
                            log.warn("No se puede modificar este campo")
                            res.status(404).send({
                                message: "No se puede modificar este campo"
                            })
                        }else{
                            User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
                                if (err) {
                                    log.error("Error general al actualizar", err)
                                    res.status(500).send({
                                        message: "Error general al actualizar"
                                    })
                                } else if (userUpdated) {
                                    log.info("Usuario actualizado :D")
                                    res.send({
                                        message: "Usuario actualizado", userUpdated
                                    })
                                } else {
                                    log.warn("No se pudo actualizar el usuario")
                                    res.status(404).send({
                                        message: "No se pudo actualizar al usuario"
                                    })
                                }
                            })   
                        }
                    } else {
                        log.warn("no se encontro ningun dato")
                        res.status(204).send({
                            message: "No se encontro ningun dato"
                        })
                    }
                }
            })
        }
    },
    removeUser: function (req, res) {
        let adminId = req.params.idA;
        let userId = req.params.idU;

        if (adminId != req.user.sub) {
            log.warn("No tienes permiso para esta accion")
            res.status(404).send({
                message: "No tienes permiso para esta accion"
            })
        } else {
            User.findById(userId, (err, userFind) => {
                if(userFind.rol === "ROL_ADMIN"){
                    log.warn("No se puede eliminar por que posee el rol de administrador")
                    res.status(404).send({
                        message: "No se puede eliminar este usuario por que es rol administrador"
                    })
                }else{
                    if (err) {
                        log.error("Error general al buscar al usuario", err)
                        res.status(500).send({
                            message: "Error general al buscar al usuario"
                        })
                    } else if (userFind) {
                        if (userFind.rol === "ROL_ADMIN") {
                            log.warn("No se puede eliminar este usuario por que posee el rol administrador")
                            res.status(404).send({
                                message: "No se puede eliminar este usuario"
                            })
                        } else {
                            User.findByIdAndRemove(userId, (err, userRemoved) => {
                                if (err) {
                                    log.error("Error al eliminar el usuario")
                                    res.status(500).send({
                                        message: "Error al eliminar el usuario"
                                    })
                                } else if (userRemoved) {
                                    log.info("Usuario eliminado")
                                    res.send({
                                        message: "Usuario eliminado", userRemoved
                                    })
                                } else {
                                    log.warn("No existe ningun dato")
                                    res.status(204).send({
                                        message: "No existe"
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
                }
            })
        }
    },
    getUsers: function (req, res) {
        let adminId = req.params.id;
        if (adminId != req.user.sub) {
            log.warn("No puedes realizar esta accion")
            res.status(404).send({
                message: "No puedes realizar esta accion"
            })
        } else {
            User.find({}).exec((err, userFind) => {
                
                if (err) {
                    log.error("Error al buscar a los usuarios", err)
                    res.status(500).send({
                        message: "Error al buscar a los usuarios"
                    })
                } else if (userFind) {
                    log.info("Usuarios encontrados :D")
                    res.send({
                        message: "Usuarios encontrados", userFind
                    })
                } else {
                    log.warn("No existe ningun usuario")
                    res.status(204).send({
                        message: "No existe"
                    })
                }
            })
        }
    }
}

module.exports = controller;