// server para testeo
var nodemailer = require('nodemailer');
var configCorreo = require('./configCorreo.json')
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", configCorreo.options);

// setup e-mail data with unicode symbols
var mailOptions = {
    from: configCorreo.from, // sender address
    to: "rafa@myariadna.com", // list of receivers
    bcc: configCorreo.copias,
    subject: "TeleTaxi Club te saluda", // Subject line
    text: "Hola TTX", // plaintext body
    html: "<b>Correo automatico desde servidor</b>" // html body
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    smtpTransport.close(); // shut down the connection pool, no more messages
});
console.log('Mailer');