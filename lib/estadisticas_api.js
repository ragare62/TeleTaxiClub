// Manejo de los mensajes para llamadas
// apyo a la api
var llamadas = require('./estadisticas');

module.exports.getNumLlamadas = function(req, res) {
    llamadas.getNumLlamadas(function(err, llamadas) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (llamadas.length === 0) {
                res.send(404, 'No se ha podido obtener la informacion');
            } else {
                res.json(llamadas);
            }
        }
    });
}

module.exports.getNumLlamadasAno = function(req, res) {
    llamadas.getNumLlamadasAno(req.params.ano, function(err, llamadas) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (llamadas.length === 0) {
                res.send(404, 'No se ha podido obtener la informacion');
            } else {
                res.json(llamadas);
            }
        }
    });
}