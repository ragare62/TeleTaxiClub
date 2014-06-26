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
    self.email = ko.observable();
    self.password = ko.observable();
}

function datosOK() {
    $('#frmLogin').validate({
        rules: {
            email: {
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
            "email": vm.email(),
            "password": vm.password()
        };
        $.ajax({
            type: "POST",
            url: "/api/login_miembro/",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                window.open('tuspuntos.html?idMiembro=' + data.idMiembro, '_self');
            },
            error: errorAjax
        });
    };
    return mf;
}