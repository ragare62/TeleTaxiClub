// maneja los mensajes de correo
var nodemailer = require('nodemailer');
var configCorreo = require('./configCorreo.json')
// create reusable transport method (opens pool of SMTP connections)

module.exports.send = function(emailf, callback) {
    var smtpTransport = nodemailer.createTransport("SMTP", configCorreo.options);
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: configCorreo.from, // sender address
        to: emailf.to, // list of receivers
        bcc: configCorreo.copias,
        subject: emailf.subject, // Subject line
        text: emailf.text, // plaintext body
        html: emailf.html // html body
    }
    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            callback(err, response);
        } else {
            callback(null, response);
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}