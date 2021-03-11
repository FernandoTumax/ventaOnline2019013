'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var billSchema = Schema({
    date: Date,
    totalProduct: Number,
    totalPrice: Number,
    products: [{type: Schema.ObjectId, ref: 'products'}]
})

module.exports = mongoose.model('bills', billSchema);