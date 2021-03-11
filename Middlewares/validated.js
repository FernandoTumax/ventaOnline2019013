const Joi = require('@hapi/joi');

const blueprintProduct = Joi.object({
    name: Joi.string().max(100).required().lowercase(),
    description: Joi.string().max(100).required().lowercase(),
    stock: Joi.number().positive().required(),
    price: Joi.number().positive().precision(2).required(),
    category: Joi.string().max(100).required().lowercase()
})

const blueprintCategory = Joi.object({
    name: Joi.string().max(100).required().lowercase(),
    description: Joi.string().max(100).required().lowercase()
})

const blueprintUserRol = Joi.object({
    username: Joi.string().max(100).required().lowercase(),
    password: Joi.string().max(100).required().lowercase(),
    name: Joi.string().max(100).required().lowercase(),
    lastname: Joi.string().max(100).required().lowercase(),
    rol: Joi.string().valid('ROL_ADMIN', 'ROL_CLIENT').required()
})

const blueprintClient = Joi.object({
    username: Joi.string().max(100).required().lowercase(),
    password: Joi.string().max(100).required().lowercase(),
    name: Joi.string().max(100).required().lowercase(),
    lastname: Joi.string().max(100).required().lowercase()
})

const blueprintUserUpdated = Joi.object({
    username: Joi.string().max(100).required().lowercase(),
    name: Joi.string().max(100).required().lowercase(),
    lastname: Joi.string().max(100).required().lowercase(),
})

const blueprintBill = Joi.object({
    totalProduct: Joi.number().positive().required()
})

const blueprintShopping = Joi.object({
    product: Joi.string().max(100).required().lowercase()
})

exports.validateProduct = (req, res, next) => {
    let result = blueprintProduct.validate(req.body, {abortEarly: false, convert: false});
    if(result.error === undefined){
        next();
    }else{
        let erroresDeValidacion = result.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        console.log(erroresDeValidacion);
        res.status(404).send({
            message: `El producto en el body debe especificar nombre, descripcion, stock y precio. Errores en tu request: ${erroresDeValidacion}`
        })
    }
}

exports.validateCategory = (req, res, next) => {
    let result = blueprintCategory.validate(req.body, {abortEarly: false, convert: false});
    if(result.error === undefined){
        next();
    }else{
        let erroresDeValidacion = result.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        console.log(erroresDeValidacion);
        res.status(404).send({
            message: `El producto en el body debe especificar nombre y descripcion. Errores en tu request: ${erroresDeValidacion}`
        })
    }
}

exports.validateUserRol = (req, res, next) => {
    let result = blueprintUserRol.validate(req.body, {abortEarly: false, convert: false});
    if(result.error === undefined){
        next();
    }else{
        let erroresDeValidacion = result.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        res.status(404).send({
            message: `El producto en el body debe especificar nombre de usuario, contraseña, nombre, apellido y rol. Errores en tu request: ${erroresDeValidacion}`
        })
    }
}

exports.validateClient = (req, res, next) => {
    let result = blueprintClient.validate(req.body, {abortEarly: false, convert: false});
    if(result.error === undefined){
        next();
    }else{
        let erroresDeValidacion = result.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        res.status(404).send({
            message: `El producto en el body debe especificar nombre de usuario, contraseña, nombre y apellido. Errores en tu request: ${erroresDeValidacion}`
        })
    }
}

exports.validateUser = (req, res, next) => {
    let result = blueprintUserUpdated.validate(req.body, {abortEarly: false, convert: false});
    if(result.error === undefined){
        next();
    }else{
        let erroresDeValidacion = result.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        res.status(404).send({
            message: `El producto en el body debe especificar nombre de usuario, nombre y apellido. Errores en tu request: ${erroresDeValidacion}`
        })
    }
}

exports.validateBill = (req, res, next) =>{
    let result = blueprintBill.validate(req.body, {abortEarly: false, convert: false});
    if(result.error === undefined){
        next();
    }else{
        let erroresDeValidacion = result.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        res.status(404).send({
            message: `El producto en el body debe especificar total de productos, total de precio y el nombre del producto. Errores en tu request: ${erroresDeValidacion}`
        })
    }
}

exports.validateShopping = (req, res, next) => {
    let result = blueprintShopping.validate(req.body, {abortEarly: false, convert: false});
    if(result.error === undefined){
        next();
    }else{
        let erroresDeValidacion = result.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
        res.status(404).send({
            message: `El producto en el body debe especificar el producto. Errores en tu request: ${erroresDeValidacion}`
        })
    }
}