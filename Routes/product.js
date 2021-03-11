'use strict'

var express = require('express');
var productController = require('../Controllers/product');
var mdAuth = require('../Middlewares/authenticated');
var validates = require('../Middlewares/validated');

var api = express.Router();

api.get('/admin/:id/products', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], productController.getProducts);
api.get('/admin/:idA/product/:idP', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], productController.getProduct);
api.post('/admin/:id/product', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, validates.validateProduct], productController.createProduct);
api.put('/admin/:idA/category/:idC/product/:idP', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, validates.validateProduct], productController.updateProduct);
api.delete('/admin/:idA/category/:idC/product/:idP', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], productController.removeProduct);

module.exports = api;