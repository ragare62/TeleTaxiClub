// tucuenta_web.js
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
    self.email = ko.observable();
}

function datosOK() {
    $('#frmLogin').validate({
        rules: {
            email: {
                required: true
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
            "email": vm.email()
        };
        // protección contra clic repetido
        // bloquear el botón (posible gif animado)
        $('#btnLogin').hide();
        $('#loader').show();
        $.ajax({
            type: "POST",
            url: "../api/login_miembro_primero/",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                $('#btnLogin').show();
                $('#loader').hide();
                bootbox.alert("Revise su correo y siga las indicaciones del mensaje de bienvenida", function() {
                    window.open('index.html', '_top');
                });
            },
            error: errorAjax
        });
    };
    return mf;
}