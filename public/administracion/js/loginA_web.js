// loginB_web.js
// Funciones javascript relacionadas con el login de 
// miembros (loginB.html)
function initForm() {
    vm = new loginData();
    ko.applyBindings(vm);
    $("#btnLogin").click(loginForm());
    $("#frmLogin").submit(function() {
        return false;
    });
}

function loginData() {
    var self = this;
    self.usuario = ko.observable();
    self.password = ko.observable();
}

function datosOK() {
    $('#frmLogin').validate({
        rules: {
            usuario: {
                required: true
            },
            password: {
                required: false
            }
        },
        messages: {

        }
    });
    $.validator.methods.date = function(value, element) {
        return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
    }
    return $('#frmLogin').valid();
}

function loginForm() {
    var mf = function() {
        if (!datosOK()) {
            bootbox.alert("Hay errores en el formulario", function() {});
            return;
        }
        var data = {
            "usuario": vm.usuario(),
            "password": vm.password()
        };
        if (vm.usuario() == "admin" && vm.password() == "admin") {
            window.open('resumen.html', '_self');
        } else {
            bootbox.alert("Usuario o contraseña incorrectos");
        }
    };
    return mf;
}