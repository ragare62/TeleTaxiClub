// tusdatos_web.js
// Contiene las funciones de control de la página
// tusdatos.html que mantienen los datos de miembros.
function initForm() {
    var idMiembro = gup('idMiembro');
    vm = new miembroModel();
    ko.applyBindings(vm);
    cargarMiembro(idMiembro);
    $("#btnGuardar1").click(aceptarForm());
    $("#btnGuardar2").click(aceptarForm());
    $("#frmMiembro").submit(function() {
        return false;
    });
}

function miembroModel() {
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
    // no pertenece al modelo pero
    // da apoyo
    self.pass1 = ko.observable();
    self.pass2 = ko.observable();
    //
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
}

function datosOK() {
    var dok = false;
    $('#frmMiembro').validate({
        rules: {
            email: {
                required: true
            },
            nombre: {
                required: true
            },
            primerApellido: {
                required: true
            },
            telefono1: {
                required: true,
                number: true
            },
            telefono2: {
                required: false,
                number: true
            },
            telefono3: {
                required: false,
                number: true
            },
            telefono4: {
                required: false,
                number: true
            },
            telefono2: {
                required: false,
                number: true
            },
            pass1: {
                required: true
            },
            pass2: {
                required: true
            },
        },
        messages: {

        }
    });
    $.validator.methods.date = function(value, element) {
        return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
    }
    dok = $('#frmMiembro').valid();
    // validamos si ha introducido password y que sean iguales
    if (vm.pass1()) {
        if (vm.pass1() !== vm.pass2()) {
            bootbox.alert("Las contraseñas no coinciden", function() {});
            dok = false;
        } else {
            // las contraseñas coinciden, quiere cambiaralas
            vm.password(vm.pass1());
        }
    }
    return dok;
}

function cargarMiembro(idMiembro) {
    // si la hay cargamos los datos del premio con el id pasado
    if (idMiembro) {
        // búsqueda del registro implicado
        $.ajax({
            type: "GET",
            url: "/api/miembros/" + idMiembro,
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
                });
            }
        });
    } else {
        bootbox.alert("Ha accedido a esta página desde un enlace inválido", function() {
            window.open('http://www.teletaxivalencia.com', '_self');
        });
    }
}

function aceptarForm() {
    var mf = function() {
        if (!datosOK()) {
            bootbox.alert("Hay errores en el formulario", function() {});
            return;
        }
        var data = {
            "idMiembro": vm.idMiembro(),
            "nombre": vm.nombre(),
            "primerApellido": vm.primerApellido(),
            "segundoApellido": vm.segundoApellido(),
            "email": vm.email(),
            "direccion": vm.direccion(),
            "codigoPostal": vm.codigoPostal(),
            "poblacion": vm.poblacion(),
            "provincia": vm.provincia(),
            "comunidad": vm.comunidad(),
            "pais": vm.pais(),
            "password": vm.password(),
            "telefono1": vm.telefono1(),
            "telefono2": vm.telefono2(),
            "telefono3": vm.telefono3(),
            "telefono4": vm.telefono4(),
            "telefono5": vm.telefono5()
        };
        if (vm.idMiembro()) {
            $.ajax({
                type: "PUT",
                url: "/api/miembros/" + vm.idMiembro(),
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que estudiar que hacer cuando cambie 
                    // los datos correctamente
                    //window.open('premios.html', '_self');
                    bootbox.alert("El proceso de alta ha finalizado correctamente. Ya puede acceder al espacio club", function() {
                        window.open('/miembros/loginB.html');
                    });
                },
                error: errorAjax
            });
        }
    };
    return mf;
}