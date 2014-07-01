// puntos.js
// Soporta los verbos de la API para todo los que tiene
// que ver con el manejo de los puntos
var mysql = require('mysql');

// leyendo los parámetros
var config = require('./configMySQL.json');

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

// -----> FUNCIONES PUBLICADAS

// Devuelve un objeto JSON que corresponde a los
// puntos obtenidos, gastados y saldo del miembro
// con el idMiembro pasado
module.exports.getNumLlamadas = function(callback) {
    var connection = getConnection();
    var numeros = [];
    var sql = 'SELECT s1.numtotal, s2.numclien, s3.numclub, s1.lk';
    sql += ' FROM';
    sql += ' (SELECT COUNT(*) numtotal, CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m")) AS lk';
    sql += ' FROM aritaxi.shilla';
    sql += ' GROUP BY CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m"))';
    sql += ' ORDER BY fecha) AS s1';
    sql += ' LEFT JOIN';
    sql += ' (SELECT COUNT(*) AS numclien, CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m")) AS lk';
    sql += ' FROM aritaxi.shilla';
    sql += ' WHERE NOT codclien IS NULL';
    sql += ' GROUP BY CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m"))';
    sql += ' ORDER BY fecha) AS s2 ON s2.lk = s1.lk';
    sql += ' LEFT JOIN';
    sql += ' (SELECT COUNT(*) AS numclub, CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m")) AS lk';
    sql += ' FROM aritaxi.shilla AS sl';
    sql += ' RIGHT JOIN teletaxi_club.miembro AS m ON (';
    sql += ' sl.telefono = m.telefono1';
    sql += ' OR sl.telefono = m.telefono2';
    sql += ' OR sl.telefono = m.telefono3';
    sql += ' OR sl.telefono = m.telefono4';
    sql += ' OR sl.telefono = m.telefono5';
    sql += ' )';
    sql += ' GROUP BY CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m"))';
    sql += ' ORDER BY fecha) AS s3 ON s3.lk = s1.lk';
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        numeros = result;
        callback(null, numeros);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

module.exports.getNumLlamadasAno = function(ano, callback) {
    var connection = getConnection();
    var numeros = [];
    var sql = 'SELECT s1.numtotal, s2.numclien, s3.numclub, s1.lk';
    sql += ' FROM';
    sql += ' (SELECT COUNT(*) numtotal, CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m")) AS lk';
    sql += ' FROM aritaxi.shilla as sl';
    sql += ' WHERE YEAR(sl.fecha) = ' + ano;
    sql += ' GROUP BY CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m"))';
    sql += ' ORDER BY fecha) AS s1';
    sql += ' LEFT JOIN';
    sql += ' (SELECT COUNT(*) AS numclien, CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m")) AS lk';
    sql += ' FROM aritaxi.shilla as sl';
    sql += ' WHERE YEAR(sl.fecha) = ' + ano;
    sql += ' AND NOT codclien IS NULL';
    sql += ' GROUP BY CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m"))';
    sql += ' ORDER BY fecha) AS s2 ON s2.lk = s1.lk';
    sql += ' LEFT JOIN';
    sql += ' (SELECT COUNT(*) AS numclub, CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m")) AS lk';
    sql += ' FROM aritaxi.shilla AS sl';
    sql += ' RIGHT JOIN teletaxi_club.miembro AS m ON (';
    sql += ' sl.telefono = m.telefono1';
    sql += ' OR sl.telefono = m.telefono2';
    sql += ' OR sl.telefono = m.telefono3';
    sql += ' OR sl.telefono = m.telefono4';
    sql += ' OR sl.telefono = m.telefono5';
    sql += ' )';
    sql += ' WHERE YEAR(sl.fecha) = ' + ano;
    sql += ' GROUP BY CONCAT(YEAR(fecha),"-",DATE_FORMAT(fecha,"%m"))';
    sql += ' ORDER BY fecha) AS s3 ON s3.lk = s1.lk';
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        numeros = result;
        callback(null, numeros);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}