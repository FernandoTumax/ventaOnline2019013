'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = Schema({
    username: String,
    password: String,
    name: String,
    lastname: String,
    rol: String,
    bills: [{type: Schema.ObjectId, ref: 'bills'}],
    shoppingCars: [{type: Schema.ObjectId, ref:'products'}]
})

module.exports = mongoose.model('user', userSchema);