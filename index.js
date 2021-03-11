var mongoose = require('mongoose');
var app = require('./app');
var adminInit = require('./Controllers/admin');
var logger = require('./utils/logger');

var port = 3200;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/VentaOnlineAM', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    logger.info("La base de datos esta conectada");
    adminInit.createInit();
    adminInit.categoryDefault();
    app.listen(port, ()=>{
        logger.info("El servidor esta encendido");
    })
}).catch(err => {
    console.log(err);
})

