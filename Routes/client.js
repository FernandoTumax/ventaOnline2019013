'use strict'

var express = require('express');
var clientController = require('../Controllers/client');
var mdAuth = require('../Middlewares/authenticated');
var validates = require('../Middlewares/validated')

var api = express.Router();

api.get('/client/:id', mdAuth.ensureAuth, clientController.getClient);
api.get('/client/:id/product', mdAuth.ensureAuth, clientController.getMoreSelled);
api.get('/client/:id/productByName', mdAuth.ensureAuth, clientController.getProductByName);
api.get('/client/:id/category', mdAuth.ensureAuth, clientController.getCategorys);
api.get('/client/:id/categoryByName', mdAuth.ensureAuth, clientController.getCategoryByName);
api.post('/client', validates.validateClient, clientController.registerClient);
api.post('/client/:id/shoppingCar', [mdAuth.ensureAuth, validates.validateShopping], clientController.setShoppingCar);
api.post('/client/:idC/bill/:idP', [mdAuth.ensureAuth, validates.validateBill], clientController.setBill);
api.put('/client/:id', [mdAuth.ensureAuth, validates.validateUser], clientController.editClient);
api.delete('/client/:id', mdAuth.ensureAuth, clientController.removeClient);



module.exports = api;