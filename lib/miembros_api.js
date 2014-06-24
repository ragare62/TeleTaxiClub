// Manejo de los mensajes para miembros
// apyo a la api
var miembros = require('./miembros');

module.exports.getMiembros = function(req, res) {
    miembros.get(null, function(err, miembros) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(miembros);
        }
    });
}

module.exports.getMiembro = function(req, res) {
    miembros.get(req.params.miembro_id, function(err, miembros) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (miembros.length === 0) {
                res.send(404, 'Miembro no encontrado');
            } else {
                res.json(miembros[0]);
            }
        }
    });
}

module.exports.getMiembroDetalle = function(req, res) {
    miembros.getDetalle(req.params.miembro_id, function(err, miembros) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (miembros.length === 0) {
                res.send(404, 'Miembro no encontrado (d)');
            } else {
                res.json(miembros[0]);
            }
        }
    });
}

module.exports.postMiembro = function(req, res) {
    var miembro = req.body;
    miembros.post(miembro, function(err, miembro) {
        if (err) {
            res.send(400, err.message);
        } else {
            res.json(miembro);
        }
    });
}

module.exports.putMiembro = function(req, res) {
    var miembro = req.body;
    var id = req.params.miembro_id;
    if (id != miembro.idMiembro) {
        res.send(400, 'El ID pasado y el del objeto no coinciden');
        return;
    }
    miembros.put(miembro, function(err, miembro) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(miembro);
        }
    });
}

module.exports.deleteMiembro = function(req, res) {
    var miembro = req.body;
    var id = req.params.miembro_id;
    if (id != miembro.idMiembro) {
        res.send(400, 'El ID pasado y el del objeto no coinciden');
        return;
    }
    miembros.delete(miembro, function(err, miembro) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(miembro);
        }
    });
}