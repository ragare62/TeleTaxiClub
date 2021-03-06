// miembros.js
// Soporta los verbos de la API para todo los que tiene
// que ver con el manejo de los miembros del club
var mysql = require('mysql');
var async = require('async');
var puntos = require('./puntos');
var llamadas = require('./llamadas');
var canjes = require('./canjes');

// leyendo los parámetros
var config = require('./configMySQL.json')

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
function comprobarMiembro(miembro) {
    // debe ser un objecto
    var comprobado = 'object' === typeof miembro;
    // propiedades no nulas
    comprobado = (comprobado && miembro.hasOwnProperty('idMiembro'));
    comprobado = (comprobado && miembro.hasOwnProperty('nombre'));
    comprobado = (comprobado && miembro.hasOwnProperty('primerApellido'));
    comprobado = (comprobado && miembro.hasOwnProperty('email'));
    return comprobado;
}

// cargarDetalleMiembro
function cargarDetalleMiembro(miembro, next) {
    async.series([

            function(callback) {
                // leer las llamadas de este miembro
                llamadas.getLlamadasMiembro2(miembro.idMiembro, function(err, result) {
                    callback(err, result);
                });
            },
            function(callback) {
                // leer los canjes de este miembro
                canjes.getCanjesMiembro(miembro.idMiembro, function(err, result) {
                    callback(err, result);
                });
            },
            function(callback) {
                // leer los puntos
                puntos.getPuntosMiembro(miembro.idMiembro, function(err, result) {
                    callback(err, result);
                });
            }
        ],
        function(err, result) {
            if (err) {
                next(err, null);
                return;
            }
            miembro.llamadas = result[0];
            miembro.canjes = result[1];
            miembro.puntos = result[2];
            next(null, miembro);
        });
}


// -----> FUNCIONES PUBLICADAS

// GET
// Hay dos versiones según se pida información de un miembro
// con el id pasado o si no hay id se devuelve una lista de 
// todos los miembros de la base de datos
module.exports.get = function(id, callback) {
    var connection = getConnection();
    var miembros = null;
    // comprobamos si nos han pasado la id
    sql = 'SELECT * FROM miembro';
    if (id) {
        sql = sql + ' WHERE idMiembro = ?';
        sql = mysql.format(sql, id);
    }
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

module.exports.getDetalle = function(id, callback) {
    var connection = getConnection();
    var miembros = null;
    var miembro = null;
    // comprobamos si nos han pasado la id
    sql = 'SELECT * FROM miembro WHERE idMiembro = ?';
    sql = mysql.format(sql, id);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        miembros = result;
        if (miembros.length == 0) {
            callback(null, miembros);
            return;
        }
        miembro = result[0];
        cargarDetalleMiembro(miembro, function(err, result) {
            miembros[0] = result;
            callback(null, miembros);
            return;
        });
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

// POST
// Se usa para crear nuevos miembros.
module.exports.post = function(miembro, callback) {
    if (!comprobarMiembro(miembro)) {
        var err = new Error('El miembro pasado es incorrecto');
        callback(err);
        return;
    }
    var connection = getConnection();
    miembro.idMiembro = 0; // fuerza autoinc
    sql = 'INSERT INTO miembro SET ?';
    sql = mysql.format(sql, miembro);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
        }
        miembro.idMiembro = result.insertId;
        callback(null, miembro);
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

// PUT
// Se usa para actualizar miembros
module.exports.put = function(miembro, callback) {
    if (!comprobarMiembro(miembro)) {
        var err = new Error('El miembro pasado es incorrecto');
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = 'UPDATE miembro SET ? WHERE idMiembro = ?';
    sql = mysql.format(sql, [miembro, miembro.idMiembro]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, miembro);
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

// DELETE
// Usado para eliminar miembros de la base de datos
module.exports.delete = function(miembro, callback) {
    if (!comprobarMiembro(miembro)) {
        var err = new Error('El miembro pasado es incorrecto');
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = 'DELETE FROM miembro WHERE idMiembro = ?';
    sql = mysql.format(sql, miembro.idMiembro);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}