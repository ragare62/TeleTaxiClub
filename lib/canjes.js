// canjes.js
// Soporta los verbos de la API para todo los que tiene
// que ver con el manejo de los canjes de premios
var mysql = require('mysql');

// para procesamiento síncrono
var async = require('async');
var moment = require('moment');

// leyendo los parámetros
var config = require('./configMySQL.json')
// para leer los miembros y premios asociados
var miembros = require('./miembros');
var premios = require('./premios');
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

// comprobarCanje
// Comprueba que el objeto cumple con las condiciones mínimas
// para guardarlo en la base de datos.
function comprobarCanje(canje) {
    // debe ser un objecto
    var comprobado = 'object' === typeof canje;
    // propiedades no nulas
    comprobado = (comprobado && canje.hasOwnProperty('idCanje'));
    comprobado = (comprobado && canje.hasOwnProperty('idMiembro'));
    comprobado = (comprobado && canje.hasOwnProperty('fecha'));
    comprobado = (comprobado && canje.hasOwnProperty('idPremio'));
    comprobado = (comprobado && canje.hasOwnProperty('unidades'));
    return comprobado;
}

function comprobarCanjeCorto(canje) {
    // debe ser un objecto
    var comprobado = 'object' === typeof canje;
    // propiedades no nulas
    comprobado = (comprobado && canje.hasOwnProperty('idCanje'));
    return comprobado;
}

// -----> FUNCIONES PUBLICADAS

// GET
// Hay dos versiones según se pida información de un miembro
// con el id pasado o si no hay id se devuelve una lista de 
// todos los canjes de la base de datos
module.exports.get = function(id, callback) {
    var connection = getConnection();
    var canjes = [];
    // comprobamos si nos han pasado la id
    sql = 'SELECT c.idCanje, m.idMiembro, m.nombre, m.primerApellido, m.segundoApellido, c.fecha, p.idPremio, p.titulo, c.unidades, c.puntos';
    sql += ' FROM canjes AS c';
    sql += ' LEFT JOIN miembro AS m ON m.idMiembro = c.idMiembro';
    sql += ' LEFT JOIN premio AS p ON p.idPremio = c.idPremio';
    sql += ' WHERE NOT c.enCarro';
    if (id) {
        sql = sql + ' WHERE idCanje = ?';
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        // procesamos secuencialmente el resultado
        for (i = 0; i < result.length; i++) {
            var c = result[i];
            var canje = {
                idCanje: c.idCanje,
                miembro: {
                    idMiembro: c.idMiembro,
                    nombre: c.nombre,
                    primerApellido: c.primerApellido,
                    segundoApellido: c.segundoApellido
                },
                fecha: c.fecha,
                premio: {
                    idPremio: c.idPremio,
                    titulo: c.titulo,
                },
                unidades: c.unidades,
                puntos: c.puntos,
                enCarro: c.enCarro
            };
            canjes.push(canje);
        }
        callback(null, canjes);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}


module.exports.getCanjesMiembro = function(id, callback) {
    var connection = getConnection();
    var canjes = [];
    // comprobamos si nos han pasado la id
    sql = 'SELECT c.idCanje, m.idMiembro, m.nombre, m.primerApellido, m.segundoApellido, c.fecha, p.idPremio, p.titulo, c.unidades, c.puntos';
    sql += ' FROM canjes AS c';
    sql += ' LEFT JOIN miembro AS m ON m.idMiembro = c.idMiembro';
    sql += ' LEFT JOIN premio AS p ON p.idPremio = c.idPremio';
    sql += ' WHERE NOT c.enCarro';
    if (id) {
        sql = sql + ' AND m.idMiembro = ?';
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        // procesamos secuencialmente el resultado
        for (i = 0; i < result.length; i++) {
            var c = result[i];
            var canje = {
                idCanje: c.idCanje,
                miembro: {
                    idMiembro: c.idMiembro,
                    nombre: c.nombre,
                    primerApellido: c.primerApellido,
                    segundoApellido: c.segundoApellido
                },
                fecha: c.fecha,
                premio: {
                    idPremio: c.idPremio,
                    titulo: c.titulo,
                },
                unidades: c.unidades,
                puntos: c.puntos,
                enCarro: c.enCarro
            };
            canjes.push(canje);
        }
        callback(null, canjes);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

// Rceupera todos los canjes que están en un carro de un
// miembro
module.exports.getCarroMiembro = function(id, callback) {
    var connection = getConnection();
    var canjes = [];
    // comprobamos si nos han pasado la id
    sql = 'SELECT c.idCanje, m.idMiembro, m.nombre, m.primerApellido, m.segundoApellido, m.email, c.fecha, p.idPremio, p.titulo, c.unidades, c.puntos';
    sql += ' FROM canjes AS c';
    sql += ' LEFT JOIN miembro AS m ON m.idMiembro = c.idMiembro';
    sql += ' LEFT JOIN premio AS p ON p.idPremio = c.idPremio';
    sql += ' WHERE c.enCarro';
    if (id) {
        sql = sql + ' AND m.idMiembro = ?';
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        // procesamos secuencialmente el resultado
        for (i = 0; i < result.length; i++) {
            var c = result[i];
            var canje = {
                idCanje: c.idCanje,
                miembro: {
                    idMiembro: c.idMiembro,
                    nombre: c.nombre,
                    primerApellido: c.primerApellido,
                    segundoApellido: c.segundoApellido,
                    email: c.email
                },
                fecha: c.fecha,
                premio: {
                    idPremio: c.idPremio,
                    titulo: c.titulo,
                },
                unidades: c.unidades,
                puntos: c.puntos,
                enCarro: c.enCarro
            };
            canjes.push(canje);
        }
        callback(null, canjes);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}



function procesaUnCanje(element, index, array) {
    cargaCanje(element, function(err, canje) {
        array[index] = canje;
    });
}

function cargaCanje(canjeDb, next) {
    // clonación con JSON
    var canje = JSON.parse(JSON.stringify(canjeDb));
    delete canje.idMiembro;
    delete canje.idPremio;
    async.series([

            function(callback) {
                // buscar el iembro al que pertenece el canje
                if (!canjeDb.idMiembro) {
                    callback(null, null);
                    return;
                }
                miembros.get(canjeDb.idMiembro, function(err, miembros) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (miembros.length == 0) {
                        callback(null, null);
                        return;
                    }
                    callback(null, miembros[0]);
                });
            },
            function(callback) {
                // buscar el premio canjeado
                if (!canjeDb.idPremio) {
                    callback(null, null);
                    return;
                }
                premios.get(canjeDb.idPremio, function(err, premios) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (premios.length == 0) {
                        callback(null, null);
                        return;
                    }
                    callback(null, premios[0]);
                });
            }
        ],
        function(err, results) {
            canje.miembro = results[0];
            canje.premio = results[1];
            next(err, canje);
        });
}


// POST
// Se usa para crear nuevos canjes.
module.exports.post = function(canjeDb, callback) {
    if (!comprobarCanje(canjeDb)) {
        var err = new Error('El canje pasado es incorrecto');
        callback(err);
        return;
    }
    canjeDb.idCanje = 0;
    var connection = getConnection();
    sql = 'INSERT INTO canjes SET ?';
    sql = mysql.format(sql, canjeDb);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        canjeDb.idCanje = result.insertId;
        cargaCanje(canjeDb, function(err, canje) {
            callback(null, canje);
        });
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

// PUT
// Se usa para actualizar canjes
module.exports.put = function(canjeDb, callback) {
    if (!comprobarCanje(canjeDb)) {
        var err = new Error('El canje pasado es incorrecto');
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = 'UPDATE canjes SET ? WHERE idCanje = ?';
    sql = mysql.format(sql, [canjeDb, canjeDb.idCanje]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        cargaCanje(canjeDb, function(err, canje) {
            callback(null, canje);
        });
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}

// DELETE
// Usado para eliminar canjes de la base de datos
module.exports.delete = function(canjeDb, callback) {
    if (!comprobarCanjeCorto(canjeDb)) {
        var err = new Error('El canje pasado es incorrecto');
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = 'DELETE FROM canjes WHERE idCanje = ?';
    sql = mysql.format(sql, canjeDb.idCanje);
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

// deleteCarro
// lo que hace es eliminar todos los canjes que están en
// el carro del miembro pasado
module.exports.deleteCarro = function(idMiembro, callback) {
    if (!idMiembro) {
        var err = new Error('Debe indicar el miembro del que debe borrar el carro');
        callback(err);
        return;
    }
    var connection = getConnection();
    sql = 'DELETE FROM canjes WHERE enCarro AND idMiembro = ?';
    sql = mysql.format(sql, idMiembro);
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


// confirmarCarro
// lo que hace esta función es cambiar el status de los canjes
// en el carro de este miembro a --> enCarro = false
// de tal modo que pasan a ser canjes admitidos.
module.exports.confirmaCarro = function(idMiembro, callback) {
    var html = "";
    var email = "";
    var nombre = "";
    var lC = "";
    if (!idMiembro) {
        var err = new Error('Debe indicar el miembro del que debe borrar el carro');
        callback(err);
        return;
    }
    getCarroMiembroInt(idMiembro, function(err, carro) {
        if (err) {
            callback(err);
            return;
        }
        lC = "<table>";
        lC += "<thead>";
        lC += "<tr>";
        lC += "<th>Fecha</th>";
        lC += "<th>Regalo</th>";
        lC += "<th>Unidades</th>";
        lC += "<th>Puntos</th>";
        lC += "</tr>";
        lC += "</thead>";
        lC += "<tbody>";
        for (i = 0; i < carro.length; i++) {
            var canje = carro[0];
            email = canje.miembro.email;
            nombre = canje.miembro.nombre + " " + canje.miembro.primerApellido;
            lC += "<tr>";
            lC += "<td>" + moment(canje.fecha).format("DD/MM/YYYY") + "</td>";
            lC += "<td>" + canje.premio.titulo + "</td>";
            lC += "<td>" + canje.unidades + "</td>";
            lC += "<td>" + canje.puntos + "</td>";
            lC += "</tr>";
        }
        lC += "<tbody></table>"
        // ahora actualizamos los datos en DB
        var connection = getConnection();
        sql = 'UPDATE canjes SET enCarro = 0 WHERE enCarro AND idMiembro = ?';
        sql = mysql.format(sql, idMiembro);
        connection.query(sql, function(err, result) {
            if (err) {
                callback(err);
                return;
            }
            var html = "<h3>Teletaxi Valencia Club (Canje de premios)</h1>"
            html = "<p>Estimado: " + nombre + "</p>";
            html += "<p>A continuación le detallamos el canjeo de premios elegido por usted</p>"
            html += lC;
            html += "Pase por nuestras oficinas en ... para recorgerlos";
            // aqui ha funciona bien y mandamos correo
            var emailf = {
                "to": emailf,
                "subject": "TeleTaxi Valencia Club (Canje de premios)",
                "text": "",
                "html": html
            }
            correo.send(emailf, function(err, response) {
                callback(null);
                return;
            });
        });
        connection.end(function(err) {
            if (err) {
                callback(err);
                return;
            }
        });
    });
}


function getCarroMiembroInt(id, callback) {
    var connection = getConnection();
    var canjes = [];
    // comprobamos si nos han pasado la id
    sql = 'SELECT c.idCanje, m.idMiembro, m.nombre, m.primerApellido, m.segundoApellido, m.email, c.fecha, p.idPremio, p.titulo, c.unidades, c.puntos';
    sql += ' FROM canjes AS c';
    sql += ' LEFT JOIN miembro AS m ON m.idMiembro = c.idMiembro';
    sql += ' LEFT JOIN premio AS p ON p.idPremio = c.idPremio';
    sql += ' WHERE c.enCarro';
    if (id) {
        sql = sql + ' AND m.idMiembro = ?';
        sql = mysql.format(sql, id);
    }
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err);
            return;
        }
        // procesamos secuencialmente el resultado
        for (i = 0; i < result.length; i++) {
            var c = result[i];
            var canje = {
                idCanje: c.idCanje,
                miembro: {
                    idMiembro: c.idMiembro,
                    nombre: c.nombre,
                    primerApellido: c.primerApellido,
                    segundoApellido: c.segundoApellido,
                    email: c.email
                },
                fecha: c.fecha,
                premio: {
                    idPremio: c.idPremio,
                    titulo: c.titulo,
                },
                unidades: c.unidades,
                puntos: c.puntos,
                enCarro: c.enCarro
            };
            canjes.push(canje);
        }
        callback(null, canjes);
        return;
    });
    connection.end(function(err) {
        if (err) {
            callback(err);
            return;
        }
    });
}