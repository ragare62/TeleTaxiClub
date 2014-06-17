// premios.js
// Soporta los verbos de la API para todo los que tiene
// que ver con el manejo de los premios del club
var mysql = require('mysql');

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

// comprobarPremio
// Comprueba que el objeto cumple con las condiciones mínimas
// para guardarlo en la base de datos.
function comprobarPremio(premio) {
    // debe ser un objecto
    var comprobado = 'object' === typeof premio;
    // propiedades no nulas
    comprobado = (comprobado && premio.hasOwnProperty('idPremio'));
    comprobado = (comprobado && premio.hasOwnProperty('titulo'));
    comprobado = (comprobado && premio.hasOwnProperty('puntos'));
    comprobado = (comprobado && premio.hasOwnProperty('stockInicial'));
    return comprobado;
}

// comprobarPremioMinimo
// solo verificamos que es un objeto del tipo que toca y que tiene ID
// se usa en borrados
function comprobarPremioMinimo(premio) {
    // debe ser un objecto
    var comprobado = 'object' === typeof premio;
    // propiedades no nulas
    comprobado = (comprobado && premio.hasOwnProperty('idPremio'));
    return comprobado;
}


// -----> FUNCIONES PUBLICADAS

// GET
// Hay dos versiones según se pida información de un premio
// con el id pasado o si no hay id se devuelve una lista de 
// todos los miembros de la base de datos
module.exports.get = function(id, callback) {
    var connection = getConnection();
    var premios = null;
    // comprobamos si nos han pasado la id
    sql = 'SELECT * FROM premio';
    if (id) {
        sql = sql + ' WHERE idPremio = ?';
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        premios = result;
        callback(null, premios);
        return;
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
module.exports.post = function(premio, callback) {
    // TODO: en algún momento hay que comprobar que la imagen del premio
    // ha sido cargada correctamente
    if (!comprobarPremio(premio)) {
        var err = new Error('El premio pasado es incorrecto');
        callback(err);
        return;
    }
    var connection = getConnection();
    premio.idPremio = 0; // fuerza autoinc
    sql = 'INSERT INTO premio SET ?';
    sql = mysql.format(sql, premio);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
        }
        premio.idPremio = result.insertId;
        callback(null, premio);
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
module.exports.put = function(premio, callback) {
    // TODO: en algún momento hay que comprobar que la imagen del premio
    // ha sido cargada correctamente
    if (!comprobarPremio(premio)) {
        var err = new Error('El premio pasado es incorrecto');
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = 'UPDATE premio SET ? WHERE idPremio = ?';
    sql = mysql.format(sql, [premio, premio.idPremio]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, premio);
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

// DELETE
// Usado para eliminar premios de la base de datos
module.exports.delete = function(premio, callback) {
    // TODO: hay que comprobar que se elimina la imagen correspondiente
    if (!comprobarPremioMinimo(premio)) {
        var err = new Error('El premio pasado es incorrecto');
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = 'DELETE FROM premio WHERE idPremio = ?';
    sql = mysql.format(sql, premio.idPremio);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, premio);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}