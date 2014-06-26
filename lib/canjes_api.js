// Manejo de los mensajes para canjes
// apyo a la api
var canjes = require('./canjes');

module.exports.getCanjes = function(req, res) {
    canjes.get(null, function(err, canjes) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(canjes);
        }
    });
}

module.exports.getCanje = function(req, res) {
    canjes.get(req.params.canje_id, function(err, canjes) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (canjes.length === 0) {
                res.send(404, 'Canje no encontrado');
            } else {
                res.json(canjes[0]);
            }
        }
    });
}

module.exports.getCanjesMiembro = function(req, res) {
    canjes.getCanjesMiembro(req.params.miembro_id, function(err, canjes) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (canjes.length === 0) {
                res.send(404, 'No hay canjes para este miembro');
            } else {
                res.json(canjes);
            }
        }
    });
}

module.exports.getCarroMiembro = function(req, res) {
    canjes.getCarroMiembro(req.params.miembro_id, function(err, canjes) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (canjes.length === 0) {
                res.send(404, 'El carro está vacío');
            } else {
                res.json(canjes);
            }
        }
    });
}

module.exports.postCanje = function(req, res) {
    var canje = req.body;
    canjes.post(canje, function(err, Canje) {
        if (err) {
            res.send(400, err.message);
        } else {
            res.json(Canje);
        }
    });
}

module.exports.putCanje = function(req, res) {
    var canje = req.body;
    var id = req.params.canje_id;
    if (id != canje.idCanje) {
        res.send(400, 'El ID pasado y el del objeto no coinciden');
        return;
    }
    canjes.put(canje, function(err, canje) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(canje);
        }
    });
}

module.exports.deleteCanje = function(req, res) {
    var canje = req.body;
    var id = req.params.canje_id;
    if (id != canje.idCanje) {
        res.send(400, 'El ID pasado y el del objeto no coinciden');
        return;
    }
    canjes.delete(canje, function(err, canje) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json({
                message: 'OK'
            });
        }
    });
}

module.exports.deleteCarro = function(req, res) {
    var id = req.params.miembro_id;
    canjes.deleteCarro(id, function(err, canje) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json({
                message: 'OK'
            });
        }
    });
}

module.exports.confirmaCarro = function(req, res) {
    var id = req.params.miembro_id;
    canjes.confirmaCarro(id, function(err, canje) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json({
                message: 'OK'
            });
        }
    });
}