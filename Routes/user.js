'use strict'

var express = require('express');
var userController = require('../Controllers/user');
var mdAuth = require('../Middlewares/authenticated');
var api = express.Router();


api.get('/login', userController.login);

module.exports = api;