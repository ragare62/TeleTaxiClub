// Funciones de soporte a las páginas
// tucarro.html


// declaración general de variables
var tablaCarro;
var dataCarro;
var vm;


function initCarro() {
    var idMiembro = gup('idMiembro');
    vm = new modelCarro();
    ko.applyBindings(vm);
    cargarMiembro(idMiembro);
}

function loadCarro() {
    $.ajax({
        type: "GET",
        url: "../api/carro/" + vm.idMiembro(),
        dataType: "json",
        success: function(canjes, textStatus) {
            dataCarro = canjes;
            dataCarro.forEach(function(element, index, array) {
                vm.canjes.push(element);
            });
            loadTablaCanjes();
        },
        error: function(xhr, textStatus, errorThrwon) {
            bootbox.alert("CARRO:<br/>" + xhr.responseText, function() {});
        }
    });
}


function modelCarro() {
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
    self.canjes = ko.observableArray([]);
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
                loadCarro();
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

function loadTablaCanjes() {
    tablaCarro = $('#dataTableCanjes').dataTable({
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
        data: vm.canjes(),
        columns: [{
            data: "fecha",
            render: function(data) {
                // controlamos que si la fecha es nula no se muestre
                if (moment(data).isValid())
                    return moment(data).format('DD/MM/YYYY');
                else
                    return "";
            },
            class: "text-center"
        }, {
            data: "premio.titulo"
        }, {
            data: "unidades"
        }, {
            data: "puntos"
        }, {
            data: "idCanje",
            render: function(data, type, row) {
                var bt1 = "<button class='btn btn-warning' onclick='deleteCanje(" + data + ");'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var html = "<div class'text-center'> " + bt1 + "</div>"
                return html;
            }
        }]
    });
}

function deleteCanje(idCanje) {
    // primero hay que sacar un mensaje de confirmación
    bootbox.dialog({
        message: "¿Seguro que desea borrar este canje? (ID:" + idCanje + ")",
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
                        "idCanje": idCanje
                    };
                    $.ajax({
                        type: "DELETE",
                        url: "../api/canjes/" + idCanje,
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function(data, status) {
                            bootbox.alert("Registro eliminado", function() {
                                // recargar la tabla para que se vea bien
                                window.open("tucarro.html?idMiembro=" + vm.idMiembro(), '_self');
                            });
                        },
                        error: function(xhr, textStatus, errorThrwon) {
                            bootbox.alert("ERROR:<br/>" + xhr.responseText);
                        }
                    });
                }
            }
        }
    });
};

function deleteCarro(idMiembro) {
    return function(idMiembro) {
        // primero hay que sacar un mensaje de confirmación
        bootbox.dialog({
            message: "¿Desea limpiar el carro?",
            title: "Borre de registro",
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
                        $.ajax({
                            type: "DELETE",
                            url: "../api/borra_carro/" + vm.idMiembro(),
                            dataType: "json",
                            contentType: "application/json",
                            success: function(data, status) {
                                window.open("tucarro.html?idMiembro=" + vm.idMiembro(), '_self');
                            },
                            error: function(xhr, textStatus, errorThrwon) {
                                bootbox.alert("ERROR:<br/>" + xhr.responseText);
                            }
                        });
                    }
                }
            }
        });
    };
}

function confirmaCarro(idMiembro) {
    return function(idMiembro) {
        // primero hay que sacar un mensaje de confirmación
        bootbox.dialog({
            message: "¿Desea confirmar el carro?",
            title: "Canje de premios",
            buttons: {
                cancelar: {
                    label: "Cancelar",
                    className: "btn-default",
                    callback: function() {
                        // no hacemos nada es una salida de cancellar
                    }
                },
                confirmar: {
                    label: "confirmar",
                    className: "btn-success",
                    callback: function() {
                        $.ajax({
                            type: "POST",
                            url: "../api/confirma_carro/" + vm.idMiembro(),
                            dataType: "json",
                            contentType: "application/json",
                            success: function(data, status) {
                                bootbox.alert("Canje confirmado, recibirá un correo electrónico con las indicaciones. Gracias", function() {
                                    window.open("tuspuntos.html?idMiembro=" + vm.idMiembro(), '_self');
                                });
                            },
                            error: function(xhr, textStatus, errorThrwon) {
                                bootbox.alert("ERROR:<br/>" + xhr.responseText);
                            }
                        });
                    }
                }
            }
        });
    };
}