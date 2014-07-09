// login_miembro_api.js
// Este módulo soporta la verificación del login de un miembro
// Se unifica tanto los accesos a bases de datos como los verbos api
// en un único módulo
var mysql = require('mysql');
var handlebars = require('handlebars');
var fs = require('fs');
var moment = require('moment');

// leyendo los parámetros de conexión MySQL
var config = require('./configMySQL.json')
var miembros = require('./miembros');
var correo = require('./correo');

var sql = '';


// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos.
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    });
    connection.connect(function(err) {
        if (err) throw err;
    });
    return connection;
}

// closeConnection
// función auxiliar para cerrar una conexión
function closeConnection(connection) {
    connection.end(function(err) {
        if (err) {
            throw err;
        }
    });
}

// comprobarMiembro
// Comprueba que el objeto cumple con las condiciones mínimas
// para guardarlo en la base de datos.
function comprobarLoginData(loginData) {
    // debe ser un objecto
    var comprobado = 'object' === typeof loginData;
    // propiedades no nulas
    comprobado = (comprobado && loginData.hasOwnProperty('email'));
    comprobado = (comprobado && loginData.hasOwnProperty('password'));
    return comprobado;
}

function leerMiembro(email, callback) {
    var connection = getConnection();
    var miembros = null;
    // comprobamos si nos han pasado la id
    sql = 'SELECT * FROM miembro WHERE email = ?';
    sql = mysql.format(sql, email);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        miembros = result;
        callback(null, miembros);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

// Verbo de la api para login
module.exports.getLoginMiembro = function(req, res) {
    // Se espera un objeto con las propiedades
    // email y passwword.
    var loginData = req.body;
    if (!comprobarLoginData(loginData)) {
        res.send(400, 'El formato de login es incorrecto');
        return;
    }
    // leemos el miembro que correspondería
    leerMiembro(loginData.email, function(err, miembros) {
        if (err) {
            res.send(500, err.message);
            return;
        }
        if (miembros.length == 0) {
            // no se ha encontrado un miembro con esos datos
            res.send(404, "miembro no encontrado");
            return;
        }
        // ahora queda por comprobar que la password coincide
        var miembro = miembros[0];
        if (miembro.password !== loginData.password) {
            res.send(401, "Usuario o contraseña incorrectos");
            return;
        }
        // si llega hasta aquí es que todo ha ido bien.
        res.json(miembro);
    });
}

module.exports.getLoginPrimero = function(req, res) {
    // Se espera un objeto con las propiedades
    // email y passwword.
    var loginData = req.body;
    if (!loginData.email) {
        res.send(400, 'El formato de login es incorrecto');
        return;
    }
    // leemos el miembro que correspondería
    leerMiembro(loginData.email, function(err, vMiembros) {
        if (err) {
            res.send(500, err.message);
            return;
        }
        if (vMiembros.length !== 0) {
            // no se ha encontrado un miembro con esos datos
            res.send(404, "Ya existe un miembro con este correo.");
            return;
        }
        // Ahora damos de alta el miembro vacío
        var miembro = {
            idMiembro: 0,
            nombre: '',
            primerApellido: '',
            email: loginData.email,
            fechaAlta: moment().format('YYYY-MM-DD')
        }
        miembros.post(miembro, function(err, result) {
            if (err) {
                console.log("Error en LP: ", err.message);
                return;
            }
            var id = result.idMiembro;
            var data2 = {
                url: "http://" + req.headers.host + "/miembros/tusdatos_primero.html?idMiembro=" + id
            }
            // leer la plantilla que corresponde
            fs.readFile('./plantillas/plt_alta.html', function(err, data) {
                if (err) throw err;
                source = data.toString();
                var template = handlebars.compile(source);
                var html = template(data2);
                // montamos el correo electrónico
                var emailf = {
                    "to": loginData.email,
                    "subject": "TeleTaxi Valencia Club (Bienvenido al club)",
                    "html": html,
                    "generateTextFromHTML": true
                }
                correo.send(emailf, function(err, response) {
                    if (err) throw err;
                    // si llega hasta aquí es que todo ha ido bien.
                    res.json(miembro);
                });

            });
        });
    });
}