// Manejo de los mensajes para mllamadas
// apyo a la api
var llamadas = require('./llamadas');

module.exports.getLlamadas = function(req, res) {
    llamadas.get(null, function(err, llamadas) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(llamadas);
        }
    });
}

module.exports.getLlamada = function(req, res) {
    llamadas.get(req.params.llamada_id, function(err, llamadas) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (llamadas.length === 0) {
                res.send(404, 'Llamada no encontrada');
            } else {
                res.json(llamadas[0]);
            }
        }
    });
}

module.exports.getLlamadasMiembro = function(req, res) {
    llamadas.getLlamadasMiembro(req.params.miembro_id, function(err, llamadas) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (llamadas.length === 0) {
                res.send(404, 'No hay llamadas para este miembro');
            } else {
                res.json(llamadas);
            }
        }
    });
}