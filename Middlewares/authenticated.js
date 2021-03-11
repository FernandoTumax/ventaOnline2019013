'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'encriptacion-IN6AM@';

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "La peticion no lleva la autorizacion"
        })
    }else{
        var token = req.headers.authorization.replace(/['"']+/g, '');
        try{
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(404).send({
                    message: "Token ya expirado"
                })
            }
        }catch(err){
            return res.status(404).send({
                message: "Token invalido"
            })
        }
        req.user = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next) =>{
    var payload = req.user;
    if(payload.rol != "ROL_ADMIN"){
        return res.status(404).send({
            message: "No tienes permiso para ingresa a este ruta"
        })
    }else{
        return next();
    }
}