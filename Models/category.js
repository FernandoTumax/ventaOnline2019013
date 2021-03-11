'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = Schema({
    name: String,
    description: String,
    products: [{type: Schema.ObjectId, ref: 'products'}]
});


module.exports = mongoose.model('category', categorySchema);