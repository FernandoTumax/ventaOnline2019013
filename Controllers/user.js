'use strict'

var User = require('../Models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var log = require('./../utils/logger');

var controller = {
    login: function(req, res){
        var params = req.body;

        if(params.username && params.password){
            User.findOne({username: params.username}, (err, userFind) => {
                if(err){
                    log.error("Error general", err)
                    res.status(500).send({
                        message: "Error general"
                    })
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword) => {
                        if(err){
                            log.error("Error en la contraseña", err)
                            res.status(500).send({
                                message: "Error general en la contraseña"
                            })
                        }else if(checkPassword){
                            if(userFind.rol === "ROL_CLIENT"){
                                if(params.gettoken){
                                    log.info("Se ha logeado con exito :D")
                                    return res.status(200).send({
                                        token: jwt.createToken(userFind),
                                        message: `Bienvenido ${userFind.name} ${userFind.lastname}`,
                                        message: "estas son tus compras realizadas",
                                        compras: userFind.bills

                                    })
                                }else{
                                    log.info("Se ha logeado con exito :D")
                                    return res.status(200).send({
                                        message: "Usuario logeado"
                                    })
                                }
                            }else if(userFind.rol === "ROL_ADMIN"){
                                if(params.gettoken){
                                    log.info("Se ha logeado con exito :D")
                                    return res.status(200).send({
                                        token: jwt.createToken(userFind),
                                        message: `Bienvenido ${userFind.name} ${userFind.lastname}`
                                    })
                                }else{
                                    log.info("Se ha logeado con exito :D")
                                    return res.status(200).send({
                                        message: "Usuario logeado"
                                    })
                                }
                            }
                        }else{
                            log.warn("Contraseña incorrecta")
                            res.status(404).send({
                                message: "Contraseña incorrecta"
                            })
                        }
                    })
                }else{
                    log.warn("No existe ningun dato")
                    res.status(204).send({
                        message: "No existe ningun dato"
                    })
                }
            }).populate('bills')
        }else{
            log.warn("ingrese los datos obligatorios")
            res.status(404).send({
                message: "Por favor ingrese los datos oblogatorios"
            })
        }
    }
}

module.exports = controller;