'use strict'

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = Schema({
    name: String,
    description: String,
    stock: Number,
    price: Number,
    totalSale: Number
})

module.exports = mongoose.model('products', productSchema);