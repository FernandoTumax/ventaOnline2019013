'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shoppingCarSchema = Schema({
    products: [{type: Schema.ObjectId, ref:'products'}]
})

module.exports = mongoose.model('shoppingCar', shoppingCarSchema);