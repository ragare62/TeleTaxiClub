// Funciones de soporte a las páginas
// catalogoA.html
// premio.html

// declaración general de variables
var tablaPremios;
var dataPremios;
var vm;


function initCatalogo() {
    var idMiembro = gup('idMiembro');
    vm = new modelCatalogo();
    ko.applyBindings(vm);
    cargarMiembro(idMiembro);
    loadCatalogo();
}

function loadCatalogo() {
    $.ajax({
        type: "GET",
        url: "../api/premios",
        dataType: "json",
        success: function(premios, textStatus) {
            dataPremios = premios;
            dataPremios.forEach(function(element, index, array) {
                vm.premios.push(element);
            });
            //ko.applyBindings(vm);
        },
        error: errorAjax
    });
}


function modelCatalogo() {
    var self = this;
    self.idMiembro = ko.observable();
    self.nombre = ko.observable();
    self.primerApellido = ko.observable();
    self.segundoApellido = ko.observable();
    self.email = ko.observable();
    self.direccion = ko.observable();
    self.codigoPostal = ko.observable();
    self.poblacion = ko.observable();
    self.provincia = ko.observable();
    self.comunidad = ko.observable();
    self.pais = ko.observable();
    self.password = ko.observable();
    self.telefono1 = ko.observable();
    self.telefono2 = ko.observable();
    self.telefono3 = ko.observable();
    self.telefono4 = ko.observable();
    self.telefono5 = ko.observable();
    self.fechaAlta = ko.observable();
    self.nombreCompleto = ko.computed(function() {
        var nc = "Cargando..."
        if (self.primerApellido()) {
            nc = self.primerApellido();
            if (self.segundoApellido()) {
                nc += ' ' + self.segundoApellido();
            }
            nc += ", " + self.nombre();
        }
        return nc;
    });
    self.premios = ko.observableArray([]);
    // urls para página
    self.urlTuspuntos = ko.computed(function() {
        return "tuspuntos.html?idMiembro=" + self.idMiembro();
    });
    self.urlTusdatos = ko.computed(function() {
        return "tusdatos.html?idMiembro=" + self.idMiembro();
    });
    self.urlTucarro = ko.computed(function() {
        return "tucarro.html?idMiembro=" + self.idMiembro();
    });
    self.urlTucatalogo = ko.computed(function() {
        return "tucatalogo.html?idMiembro=" + self.idMiembro();
    });
    self.premio_unidades = ko.observable();
    self.premio_titulo = ko.observable();
    self.premio_id = ko.observable();
    self.premio_puntos = ko.observable();
}

function cargarMiembro(idMiembro) {
    // si la hay cargamos los datos del premio con el id pasado
    if (idMiembro) {
        // búsqueda del registro implicado
        $.ajax({
            type: "GET",
            url: "../api/miembros/" + idMiembro,
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                // ha conseguido leerlo
                vm.idMiembro(data.idMiembro);
                vm.nombre(data.nombre);
                vm.primerApellido(data.primerApellido);
                vm.segundoApellido(data.segundoApellido);
                vm.email(data.email);
                vm.direccion(data.direccion);
                vm.codigoPostal(data.codigoPostal);
                vm.poblacion(data.poblacion);
                vm.provincia(data.provincia);
                vm.comunidad(data.comunidad);
                vm.pais(data.pais);
                vm.password(data.password);
                vm.telefono1(data.telefono1);
                vm.telefono2(data.telefono2);
                vm.telefono3(data.telefono3);
                vm.telefono4(data.telefono4);
                vm.telefono5(data.telefono5);
                vm.fechaAlta(data.fechaAlta);
            },
            error: function(xhr, textStatus, errorThrwon) {
                bootbox.alert("ERROR:<br/>" + xhr.responseText, function() {
                    // regresa a la pantalla de premios
                    // normalmente es debido a un "premio no encontrado"
                    window.open('tuspuntos.html', '_self');
                });
            }
        });
    } else {
        vm.idMiembro(0);
    }
}

function formatLinkImage(name) {
    return '/images/' + name;
}

function formatFechas(desdeFecha, hastaFecha) {
    var m = "";
    if (moment(desdeFecha).isValid()) {
        m += 'Desde ' + moment(desdeFecha).format("DD/MM/YYYY");
    }
    if (moment(hastaFecha).isValid()) {
        m += ' hasta ' + moment(hastaFecha).format("DD/MM/YYYY");
    }
    return m;
}

function verDetalles(id) {
    var url = window.location.href;
    var n = url.lastIndexOf('/');
    var burl = url.substring(0, n);
    return burl + "/premio.html?IdPremio=" + id;
}

function canjear(id, titulo, puntos) {
    //alert("IdPremio: " + id + " Titulo: " + titulo);
    vm.premio_id(id);
    vm.premio_titulo(titulo);
    vm.premio_unidades(1);
    vm.premio_puntos(puntos);
}

function alCarro() {
    if (!vm.premio_unidades()) {
        bootbox.alert("Número de unidades incorrecto");
        return;
    }
    // utilizamos la librería async (https://github.com/caolan/async) 
    // para procesar las llamadas secuenciales de funciones asícronas.
    async.series([

        function(callback) {
            // controlar el número de puntos
            $.ajax({
                type: "GET",
                url: "../api/puntos/" + vm.idMiembro(),
                dataType: "json",
                contentType: "application/json",
                success: function(data, status) {
                    var puntos_elegidos = vm.premio_puntos() * vm.premio_unidades();
                    var puntos_disponibles = data[0].saldo_carro;
                    if (puntos_elegidos > puntos_disponibles) {
                        var err = {
                            message: 'Necesita ' + puntos_elegidos + ' puntos, incluyendo el carro solo dispone de ' + puntos_disponibles
                        };
                        callback(err, null);
                        return;
                    }
                    // tiene bastantes 
                    callback(null);
                },
                error: function(xhr, textStatus, errorThrwon) {
                    var err = {
                        message: xhr.responseText
                    };
                    callback(err, null);
                }
            });
        },
        function(callback) {
            // esta es la que realmente da de alta el canje para el carro.
            var canjeDb = {
                "idCanje": 0,
                "idMiembro": vm.idMiembro(),
                "fecha": moment().format("YYYY-MM-DD"),
                "idPremio": vm.premio_id(),
                "unidades": vm.premio_unidades(),
                "puntos": vm.premio_puntos() * vm.premio_unidades(),
                "enCarro": true
            };
            $.ajax({
                type: "POST",
                url: "../api/canjes/",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(canjeDb),
                success: function(data, status) {
                    // perfecto
                    callback(null);
                },
                error: function(xhr, textStatus, errorThrwon) {
                    var err = {
                        message: xhr.responseText
                    };
                    callback(err, null);
                }
            });

        }
    ], function(err, results) {
        if (err) {
            bootbox.alert("ERROR:<br/>" + err.message);
            return;
        }
        window.open("tucarro.html?idMiembro=" + vm.idMiembro(), '_self');
    });
}