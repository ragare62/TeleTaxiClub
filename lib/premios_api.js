// Es la api de premios
// devuelve las funciones que se encargan de las peticiones http
var premios = require('./premios');

module.exports.getPremios = function(req, res) {
    premios.get(null, function(err, premios) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(premios);
        }
    });
}

module.exports.postPremio = function(req, res) {
    var premio = req.body;
    premios.post(premio, function(err, premio) {
        if (err) {
            res.send(400, err.message);
        } else {
            res.json(premio);
        }
    });
}

module.exports.getPremio = function(req, res) {
    premios.get(req.params.premio_id, function(err, premios) {
        if (err) {
            res.send(500, err.message);
        } else {
            if (premios.length === 0) {
                res.send(404, 'Premio no encontrado');
            } else {
                res.json(premios[0]);
            }
        }
    });
}

module.exports.putPremio = function(req, res) {
    var premio = req.body;
    var id = req.params.premio_id;
    if (id != premio.idPremio) {
        res.send(400, 'El ID pasado y el del objeto no coinciden');
        return;
    }
    premios.put(premio, function(err, premio) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(premio);
        }
    });
}

module.exports.deletePremio = function(req, res) {
    var premio = req.body;
    var id = req.params.premio_id;
    if (id != premio.idPremio) {
        res.send(400, 'El ID pasado y el del objeto no coinciden');
        return;
    }
    premios.delete(premio, function(err, premio) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(premio);
        }
    });
}