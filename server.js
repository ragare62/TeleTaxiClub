// TAXICLUB
// Servidor principal de API
// ===============================================
// Cargar los paquetes externos
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');

// leyendo los parámetros
var config = require('./config.json')

// apoyo a las api
var miembros_api = require('./lib/miembros_api');
var premios_api = require('./lib/premios_api');
var uploads_api = require('./lib/uploads_api');

// utilizar el parseador
app.use(bodyParser());
app.use(morgan('short'));
app.use(cors());

app.use(express.static(__dirname + '/public'))

// MONTAR LAS RUTAS
// ===============================================
var router = express.Router();

// paso común a todas las rutas 
router.use(function(req, res, next) {
    // se puede usar pra tratamientos comunes a cualquier petición
    // se le pide que continue
    next();
});

// para testear que funciona la API
router.get('/', function(req, res) {
    res.json({
        mensaje: "API base Teletaxi-Club"
    });
});


// INICIO Rutas relacionadas con miembros
//===================================================================
router.route('/miembros')
    .get(miembros_api.getMiembros)
    .post(miembros_api.postMiembro);

router.route('/miembros/:miembro_id')
    .get(miembros_api.getMiembro)
    .put(miembros_api.putMiembro)
    .delete(miembros_api.deleteMiembro);

//===================================================================
// FIN Rutas relacionadas con miembros


// INICIO Rutas relacionadas con premios
//===================================================================
router.route('/premios')
    .get(premios_api.getPremios)
    .post(premios_api.postPremio);

router.route('/premios/:premio_id')
    .get(premios_api.getPremio)
    .put(premios_api.putPremio)
    .delete(premios_api.deletePremio);

//===================================================================
// FIN Rutas relacionadas con premios

// Rutas relacionadas con carga de ficheros
//====================================================================

router.route('/uploads/:premio_id')
    .post(uploads_api.uploadImagenPremio(__dirname));


//====================================================================
// FIN Rutas relacionadas con carga de ficheros

// REGISTRAR LAS RUTAS
app.use('/api', router);

// START SERVER
//==========================
app.listen(config.apiPort);
console.log("Teletaxi-Club API en puerto: ", config.apiPort);