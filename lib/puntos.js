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
module.exports.getPuntosMiembro = function(idMiembro, callback) {
    var connection = getConnection();
    var puntos = [];
    var sql = 'SELECT ps.obtenidos, cs.gastados, cr.carro, (ps.obtenidos-cs.gastados) AS saldo, (ps.obtenidos-cs.gastados-cr.carro) AS saldo_carro';
    sql += ' FROM';
    sql += ' (SELECT 1 AS id, COUNT(*) AS obtenidos';
    sql += ' FROM teletaxi_club.miembro AS m';
    sql += ' LEFT JOIN aritaxi.shilla AS sh';
    sql += ' ON (sh.telefono = m.telefono1';
    sql += ' OR sh.telefono = m.telefono2';
    sql += ' OR sh.telefono = m.telefono3';
    sql += ' OR sh.telefono = m.telefono4';
    sql += ' OR sh.telefono = m.telefono5)';
    sql += ' WHERE m.idMiembro = ?';
    sql += ' AND sh.fecha >= m.fechaAlta) AS ps';
    sql += ' LEFT JOIN';
    sql += ' (SELECT 1 AS id, COALESCE(SUM(c.puntos),0) AS gastados';
    sql += ' FROM teletaxi_club.canjes AS c';
    sql += ' WHERE c.idMiembro = ? AND NOT c.enCarro) AS cs';
    sql += ' ON cs.id = ps.id';
    sql += ' LEFT JOIN';
    sql += ' (SELECT 1 AS id, COALESCE(SUM(c.puntos),0) AS carro';
    sql += ' FROM teletaxi_club.canjes AS c';
    sql += ' WHERE c.idMiembro = ? AND c.enCarro) AS cr';
    sql += ' ON cr.id = ps.id;';
    sql = mysql.format(sql, [idMiembro, idMiembro, idMiembro]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        puntos = result;
        callback(null, puntos);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}