// llamadas.js
// Soporta los verbos de la API para todo los que tiene
// que ver con el manejo de las llamadas a la central
var mysql = require('mysql');

// leyendo los parámetros
var config = require('./configMySQL.json');
// necesario para sacar las llamadas de un miembro
var miembros = require('./miembros.js');

var sql = '';


// getConnection 
// función auxiliar para obtener una conexión al servidor
// de base de datos. Hay que tener en cuenta que se las llamadas
// están en otra base de datos
function getConnection() {
    var connection = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database_llamadas,
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

// -----> FUNCIONES PUBLICADAS

// GET
// Hay dos versiones según se pida información de una llamada en concreto
// o de todas las llamadas
module.exports.get = function(id, callback) {
    var connection = getConnection();
    var miembros = null;
    // comprobamos si nos han pasado la id
    sql = 'SELECT * FROM shilla';
    if (id) {
        sql = sql + ' WHERE idservic = ?';
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

module.exports.getLlamadasMiembro = function(idMiembro, callback) {
    // lo primero es obtener el miembro
    miembros.get(idMiembro, function(err, miembros) {
        if (err) {
            callback(err);
            return;
        }
        if (miembros.length == 0) {
            var err = {};
            err.message = "Miembro no encontrado";
            callback(err);
            return;
        }
        // Ahora cogemos el miembro que hemos encontrado y cogemos sus teléfonos
        var miembro = miembros[0];
        if (!miembro.telefono1 && !miembro.telefono2 && !miembro.telefono3 && !miembro.telefono4 && !miembro.telefono5) {
            // no tiene teléfono por lo tanto no hay llamadas
            callback(null, []);
            return;
        }
        var inSql = " IN(";
        if (miembro.telefono1) inSql += "'" + miembro.telefono1 + "',";
        if (miembro.telefono2) inSql += "'" + miembro.telefono2 + "',";
        if (miembro.telefono3) inSql += "'" + miembro.telefono3 + "',";
        if (miembro.telefono4) inSql += "'" + miembro.telefono4 + "',";
        if (miembro.telefono5) inSql += "'" + miembro.telefono5 + "',";
        // eliminamos la última coma y cerramos el paréntesis
        inSql = inSql.replace(/,$/, '') + ')';
        // buscamos todas las llamadas que ha venido de esos teléfonos.
        var connection = getConnection();
        var llamadas = null;
        var sql = 'SELECT * from shilla where telefono ' + inSql;
        console.log("SQL: ", sql);
        connection.query(sql, function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            llamadas = result;
            callback(null, llamadas);
            return;
        });
        connection.end(function(err) {
            if (err) {
                callback(err);
                return;
            }
        });
    });
}

module.exports.getLlamadasMiembro2 = function(idMiembro, callback) {
    var connection = getConnection();
    var llamadas = [];
    var sql = 'SELECT sh.*'
    sql += ' FROM teletaxi_club.miembro AS m';
    sql += ' LEFT JOIN aritaxi.shilla AS sh';
    sql += ' ON (sh.telefono = m.telefono1';
    sql += ' OR sh.telefono = m.telefono2';
    sql += ' OR sh.telefono = m.telefono3';
    sql += ' OR sh.telefono = m.telefono4';
    sql += ' OR sh.telefono = m.telefono5)';
    sql += ' WHERE m.idMiembro = ?';
    sql += ' AND sh.fecha >= m.fechaAlta';
    sql = mysql.format(sql, idMiembro);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        llamadas = result;
        callback(null, llamadas);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}