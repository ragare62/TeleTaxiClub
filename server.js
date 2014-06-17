// TAXICLUB
// Servidor principal de API
// ===============================================
// Cargar los paquetes externos
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cors = require('cors');
var formidable = require('formidable');
// leyendo los parámetros
var config = require('./config.json')
// apyo a la api
var miembros = require('./lib/miembros');
var premios = require('./lib/premios');
// manejo de ficheros
var fs = require('fs');

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
    .get(function(req, res) {
        miembros.get(null, function(err, miembros) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(miembros);
            }
        });
    })
    .post(function(req, res) {
        var miembro = req.body;
        miembros.post(miembro, function(err, miembro) {
            if (err) {
                res.send(400, err.message);
            } else {
                res.json(miembro);
            }
        });
    });

router.route('/miembros/:miembro_id')
    .get(function(req, res) {
        miembros.get(req.params.miembro_id, function(err, miembros) {
            if (err) {
                res.send(500, err.message);
            } else {
                if (miembros.length === 0) {
                    res.send(404, 'Miembro no encontrado');
                } else {
                    res.json(miembros[0]);
                }
            }
        });
    })
    .put(function(req, res) {
        var miembro = req.body;
        var id = req.params.miembro_id;
        if (id != miembro.idMiembro) {
            res.send(400, 'El ID pasado y el del objeto no coinciden');
            return;
        }
        miembros.put(miembro, function(err, miembro) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(miembro);
            }
        });
    })
    .delete(function(req, res) {
        var miembro = req.body;
        var id = req.params.miembro_id;
        if (id != miembro.idMiembro) {
            res.send(400, 'El ID pasado y el del objeto no coinciden');
            return;
        }
        miembros.delete(miembro, function(err, miembro) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(miembro);
            }
        });
    });

//===================================================================
// FIN Rutas relacionadas con miembros


// INICIO Rutas relacionadas con premios
//===================================================================
router.route('/premios')
    .get(function(req, res) {
        premios.get(null, function(err, premios) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(premios);
            }
        });
    })
    .post(function(req, res) {
        var premio = req.body;
        premios.post(premio, function(err, premio) {
            if (err) {
                res.send(400, err.message);
            } else {
                res.json(premio);
            }
        });
    });

router.route('/premios/:premio_id')
    .get(function(req, res) {
        premios.get(req.params.premio_id, function(err, premios) {
            if (err) {
                res.send(500, err.message);
            } else {
                if (premios.length === 0) {
                    res.send(404, 'Premio no encontrado');
                } else {
                    res.json(premios[0]);
                }
            }
        });
    })
    .put(function(req, res) {
        var premio = req.body;
        var id = req.params.premio_id;
        if (id != premio.idPremio) {
            res.send(400, 'El ID pasado y el del objeto no coinciden');
            return;
        }
        premios.put(premio, function(err, premio) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(premio);
            }
        });
    })
    .delete(function(req, res) {
        var premio = req.body;
        var id = req.params.premio_id;
        if (id != premio.idPremio) {
            res.send(400, 'El ID pasado y el del objeto no coinciden');
            return;
        }
        premios.delete(premio, function(err, premio) {
            if (err) {
                res.send(500, err.message);
            } else {
                res.json(premio);
            }
        });
    });

//===================================================================
// FIN Rutas relacionadas con premios

// Rutas relacionadas con carga de ficheros
//====================================================================

router.route('/uploads/:premio_id')
    .post(function(req, res) {
        var idPremio = req.params.premio_id;
        //console.log("IDPREMIO:", idPremio)
        if (!isFormData(req)) {
            res.statusCode = 404;
            res.end('Petición incorrecta: se esperaba multipart/form-data');
            return;
        }

        var form = new formidable.IncomingForm();
        //form.on('progress', function(bytesReceived, bytesExpected) {
        //    var percent = Math.floor(bytesReceived / bytesExpected * 100);
        //    console.log(percent);
        //});

        form.parse(req, function(err, fields, files) {
            //console.log(fields);
            //console.log(files);
            fs.readFile(files.file.path, function(err, data) {
                var newPath = __dirname + "\\public\\images\\" + files.file.name;
                //console.log("FICHERO: ", newPath)
                //fs.writeFile(newPath, data, function(err) {
                //    if (err) throw err;
                //});
                fs.rename(files.file.path, newPath, function(err) {
                    if (err) throw err;
                });
            });
            var data = {};
            data.Status = 1
            data.FullUrl = req.protocol + '://' + req.get('host') + '//images//' + files.file.name;
            data.FileName = files.file.name;
            res.json(data);
        });
    });

function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}

//====================================================================
// FIN Rutas relacionadas con carga de ficheros

// REGISTRAR LAS RUTAS
app.use('/api', router);

// START SERVER
//==========================
app.listen(config.apiPort);
console.log("Teletaxi-Club API en puerto: ", config.apiPort);