'use strict'

var express = require('express');
var categoryController = require('../Controllers/category');
var mdAuth = require('../Middlewares/authenticated');
var validates = require('../Middlewares/validated');

var api = express.Router();

api.get('/admin/:id/category', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], categoryController.getCategorys);
api.post('/admin/:id/category', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, validates.validateCategory], categoryController.createCategory);
api.put('/admin/:idA/category/:idC', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, validates.validateCategory], categoryController.updateCategory);
api.delete('/admin/:idA/category/:idC', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], categoryController.removeCategory);

module.exports = api;