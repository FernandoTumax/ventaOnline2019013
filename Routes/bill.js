'use strict'

var express = require('express');
var billController = require('../Controllers/bill');
var mdAuth = require('../Middlewares/authenticated');
var validates = require('../Middlewares/validated');

var api = express.Router();

api.post('/admin/:id/bill', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, validates.validateBill], billController.createBill);
api.get('/admin/:id/billProduct', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], billController.getBillUser);
api.get('/admin/:id/productSoldOut', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], billController.getSoldOut);
api.get('/admin/:id/productMoreSell', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], billController.getMoreSelled);

module.exports = api;