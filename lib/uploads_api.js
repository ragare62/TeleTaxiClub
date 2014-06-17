// Se encarga de los mensajes para carga de ficheros
//
// manejo de ficheros
var fs = require('fs');
var formidable = require('formidable');

function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}

module.exports.uploadImagenPremio = function(directory) {
    var mfun = function(req, res) {
        var idPremio = req.params.premio_id;
        //console.log("IDPREMIO:", idPremio)
        if (!isFormData(req)) {
            res.statusCode = 404;
            res.end('Petición incorrecta: se esperaba multipart/form-data');
            return;
        }

        var form = new formidable.IncomingForm();
        //form.on('progress', function(bytesReceived, bytesExpected) {
        //    var percent = Math.floor(bytesReceived / bytesExpected * 100);
        //    console.log(percent);
        //});

        form.parse(req, function(err, fields, files) {
            //console.log(fields);
            //console.log(files);
            fs.readFile(files.file.path, function(err, data) {
                var oldPath = files.file.path;
                var newPath = directory + "\\public\\images\\" + files.file.name;
                fs.rename(files.file.path, newPath, function(err) {
                    if (err) throw err;
                });
            });
            var data = {};
            data.Status = 1
            data.FullUrl = req.protocol + '://' + req.get('host') + '//images//' + files.file.name;
            data.FileName = files.file.name;
            res.json(data);
        });
    };
    return mfun;
}