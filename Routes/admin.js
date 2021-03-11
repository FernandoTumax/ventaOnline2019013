'use strict'

var express = require('express');
var adminController = require('../Controllers/admin');
var mdAuth = require('../Middlewares/authenticated');
var validates = require('../Middlewares/validated');

var api = express.Router();

api.get('/prueba', adminController.prueba);

api.post('/admin/:id/user', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, validates.validateUserRol], adminController.createUser);
api.put('/admin/:idA/user/:idU', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, validates.validateUser], adminController.updateUser);
api.delete('/admin/:idA/user/:idU', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], adminController.removeUser);

module.exports = api;