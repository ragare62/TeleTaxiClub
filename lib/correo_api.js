// Manejo api del correo electrónico
var correo = require('./correo');

module.exports.postCorreo = function(req, res) {
    var emailf = req.body;
    correo.send(emailf, function(err, response) {
        if (err) {
            res.send(500, err.message);
        } else {
            res.json(response);
        }
    });
}