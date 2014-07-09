// Funciones de soporte a las páginas
// premios.html
// premio.html

// declaración general de variables
var tablaPremios;
var dataPremios;
var vm;

//------------ premios.html

function deletePremio(idPremio) {
    // primero hay que sacar un mensaje de confirmación
    bootbox.dialog({
        message: "¿Seguro que desea borrar el registro? (ID:" + idPremio + ")",
        title: "Borrado de registro",
        buttons: {
            cancelar: {
                label: "Cancelar",
                className: "btn-default",
                callback: function() {
                    // no hacemos nada es una salida de cancellar
                }
            },
            borrar: {
                label: "Borrar",
                className: "btn-danger",
                callback: function() {
                    var data = {
                        "idPremio": idPremio
                    };
                    $.ajax({
                        type: "DELETE",
                        url: "../api/premios/" + idPremio,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function(data, status) {
                            bootbox.alert("Registro eliminado", function() {
                                // recargar la tabla para que se vea bien
                                window.open("premios.html", '_self');
                            });
                        },
                        error: errorAjax
                    });
                }
            }
        }
    });
};

function editPremio(idPremio) {
    // hay que abrir la página de premio
    // pasando en la url ese ID
    var url = "premio.html?IdPremio=" + idPremio;
    window.open(url, '_self');
};

function loadPremios() {
    $.ajax({
        type: "GET",
        url: "../api/premios",
        dataType: "json",
        success: function(premios, textStatus) {
            dataPremios = premios;
            loadTablaPremios();
        },
        error: errorAjax
    });
}

function loadTablaPremios() {
    tablaPremios = $('#dataTableMiembros').dataTable({
        language: {
            processing: "Procesando...",
            search: "Buscar: ",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataPremios,
        columns: [{
            data: "titulo"
        }, {
            data: "puntos",
            class: "text-right"
        }, {
            data: "desdeFecha",
            render: function(data) {
                // controlamos que si la fecha es nula no se muestre
                if (moment(data).isValid())
                    return moment(data).format('DD/MM/YYYY');
                else
                    return "";
            },
            class: "text-center"
        }, {
            data: "hastaFecha",
            render: function(data) {
                // controlamos que si la fecha es nula no se muestre
                if (moment(data).isValid())
                    return moment(data).format('DD/MM/YYYY');
                else
                    return "";
            },
            class: "text-center"
        }, {
            data: "idPremio",
            render: function(data) {
                var bt1 = "<button class='btn btn-success' onclick='editPremio(" + data + ");'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-danger' onclick='deletePremio(" + data + ");'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var html = "<div class'text-center'> " + bt1 + " " + bt2 + "</div>"
                return html;
            },
        }]
    });
}

//------------ premio.html

function initForm() {
    var idPremio = gup('IdPremio');
    vm = new viewModel();
    ko.applyBindings(vm);
    cargarPremio(idPremio);
    $("#btnAceptar").click(aceptarForm());
    $("#frmPremio").submit(function() {
        return false;
    });
}

function viewModel() {
    var self = this;
    self.idPremio = ko.observable();
    self.titulo = ko.observable();
    self.descripcion = ko.observable();
    self.puntos = ko.observable();
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    self.stockInicial = ko.observable();
    self.nombreFichero = ko.observable();
    self.textoCanje = ko.observable();
}

function datosOK() {
    $('#frmPremio').validate({
        rules: {
            titulo: {
                required: true
            },
            descripcion: {
                required: false
            },
            puntos: {
                required: true,
                number: true
            },
            desdeFecha: {
                required: false,
                date: true
            },
            hastaFecha: {
                required: false,
                date: true
            },
            stockInicial: {
                required: true
            }
        },
        messages: {

        }
    });
    $.validator.methods.date = function(value, element) {
        return this.optional(element) || moment(value, "DD/MM/YYYY").isValid();
    }
    return $('#frmPremio').valid();
}

function aceptarForm() {
    var mf = function() {
        if (!datosOK()) {
            bootbox.alert("Hay errores en el formulario", function() {});
            return;
        }
        // tratamiento de las posibles fechas nulas
        var desdeFecha;
        if (moment(vm.desdeFecha(), "DD/MM/YYYY").isValid())
            var desdeFecha = moment(vm.desdeFecha(), "DD/MM/YYYY").format("YYYY-MM-DD");
        var hastaFecha;
        if (moment(vm.hastaFecha(), "DD/MM/YYYY").isValid())
            var hastaFecha = moment(vm.hastaFecha(), "DD/MM/YYYY").format("YYYY-MM-DD");
        var data = {
            "idPremio": vm.idPremio(),
            "titulo": vm.titulo(),
            "descripcion": vm.descripcion(),
            "puntos": vm.puntos(),
            "desdeFecha": desdeFecha,
            "hastaFecha": hastaFecha,
            "stockInicial": vm.stockInicial(),
            "nombreFichero": vm.nombreFichero(),
            "textoCanje": vm.textoCanje()
        };
        if (vm.idPremio()) {
            $.ajax({
                type: "PUT",
                url: "../api/premios/" + vm.idPremio(),
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    window.open('premios.html', '_self');
                },
                error: errorAjax
            });
        } else {
            data.idPremio = 0;
            $.ajax({
                type: "POST",
                url: "../api/premios/",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    window.open('premios.html', '_self');
                },
                error: errorAjax
            });
        }
    };
    return mf;
}

function sucUpload(file, data) {
    $('#imagen').attr('src', '../images/' + data.FileName);
    vm.nombreFichero(data.FileName);
}

function errUpload(file, data) {
    console.log('ErrUpload');
    console.log('file: ', file);
    console.log('data: ', data);
    vm.nombreFichero(null);
}

function createUpload(idPremio) {
    if (!idPremio) idPremio = 0;
    // montar el control de carga
    $("#uploadImage").pekeUpload({
        theme: "bootstrap",
        multi: false,
        btnText: "Cargar / cambiar imagen",
        url: "../api/uploads/" + idPremio,
        onFileError: errUpload,
        onFileSuccess: sucUpload,
    });
}

function cargarPremio(idPremio) {
    // si la hay cargamos los datos del premio con el id pasado
    if (idPremio) {
        // búsqueda del registro implicado
        $.ajax({
            type: "GET",
            url: "../api/premios/" + idPremio,
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                // ha conseguido leerlo
                vm.idPremio(data.idPremio);
                vm.titulo(data.titulo);
                vm.descripcion(data.descripcion);
                vm.puntos(data.puntos);
                if (moment(data.desdeFecha).isValid())
                    vm.desdeFecha(moment(data.desdeFecha).format('DD/MM/YYYY'));
                else
                    vm.desdeFecha("");
                if (moment(data.hastaFecha).isValid())
                    vm.hastaFecha(moment(data.hastaFecha).format('DD/MM/YYYY'));
                else
                    vm.hastaFecha("");
                vm.stockInicial(data.stockInicial);
                vm.nombreFichero(data.nombreFichero);
                if (vm.nombreFichero()) {
                    $('#imagen').attr('src', "../images/" + vm.nombreFichero());
                }
                vm.textoCanje(data.textoCanje);
                createUpload(vm.idPremio());
            }
        });

    } else {
        vm.idPremio(0);
        createUpload();
    }
}