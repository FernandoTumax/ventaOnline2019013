'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var adminRoutes = require('./Routes/admin');
var userRoutes = require('./Routes/user');
var clientRoutes = require('./Routes/client');
var productRoutes = require('./Routes/product');
var categoryRoutes = require('./Routes/category');
var billRoutes = require('./Routes/bill');
var logger = require('./utils/logger');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('short',{
    stream: {
        write: message => logger.info(message.trim())
    }
}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/controlVentas/v1', adminRoutes);
app.use('/controlVentas/v1', userRoutes);
app.use('/controlVentas/v1', clientRoutes);
app.use('/controlVentas/v1', productRoutes);
app.use('/controlVentas/v1', categoryRoutes);
app.use('/controlVentas/v1', billRoutes);
module.exports = app;