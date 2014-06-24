// Manejo de los mensajes para puntos
// apyo a la api
var llamadas = require('./puntos');

module.exports.getPuntosMiembro = function(req, res) {
    llamadas.getPuntosMiembro(req.params.miembro_id, function(err, puntos) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (puntos.length === 0) {
                res.send(404, 'No hay información de puntos para este miembro');
            } else {
                res.json(puntos);
            }
        }
    });
}