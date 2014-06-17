// General purpouse test

var miembros = require('./lib/miembros');
console.log('He cargado miembros');

miembros.init('localhost', 'root', 'aritel', 'teletaxi_club');
console.log('He abierto la base de datos');

// crear un objeto para darlo de alta en la base de datos

var miembro = {
    idMiembro: 0,
    primerApellido: 'Gonzalez',
    segundoApellido: 'Perez',
    nombre: 'Alberto',
    email: 'cd@gmail.com',
    direccion: 'Calle del Caño 12',
    codigoPostal: '46017',
    poblacion: 'Valencia',
    provincia: 'Valencia',
    comunidad: 'Valencia',
    password: '1234'
}

/*
miembros.post(miembro, function(err, miembro) {
    if (err) {
        console.log(err);
    } else {
        console.log('Miembro dado de alta');
        console.log(JSON.stringify(miembro));
    }
});
*/

/*
miembros.get(null, function(err, miembros) {
    if (err) {
        console.log(err);
    } else {
        console.log('Miembros leidos: ', miembros.length);
        console.log(JSON.stringify(miembros));
    }
});
*/

miembros.get(3, function(err, miembros) {
    if (err) {
        console.log(err);
    } else {
        console.log('Miembros leidos: ', miembros.length);
        console.log(JSON.stringify(miembros[0]));
    }
});

miembro = {
    idMiembro: 3,
    primerApellido: 'XGonzalez',
    segundoApellido: 'XPerez',
    nombre: 'XAlberto',
    email: 'xcd@gmail.com',
    direccion: 'XCalle del Caño 12',
    codigoPostal: '46017X',
    poblacion: 'ValenciaX',
    provincia: 'ValenciaX',
    comunidad: 'ValenciaX',
    password: '1234'
}


miembros.put(miembro, function(err, miembro) {
    if (err) {
        console.log(err);
    } else {
        console.log('Miembros actualizado (****): ', miembro);
    }
});

miembro.idMiembro = 4;

miembros.delete(miembro, function(err, miembro) {
    if (err) {
        console.log(err);
    } else {
        console.log('Miembros actualizado: ');
        console.log(JSON.stringify(miembro));
    }
});