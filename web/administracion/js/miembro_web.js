// miembro_web.js
// 
var tablaLlamadas;
var dataLlamadas;
var tablaCanjes;
var dataCanjes;

function initMiembro() {
    var idMiembro = gup('idMiembro');
    vm = new miembroModel();
    ko.applyBindings(vm);
    cargarMiembroDetalle(idMiembro);
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

    self.fechaAltaFormada = ko.computed(function() {
        var f = "";
        if (moment(self.fechaAlta()).isValid()) {
            f = moment(self.fechaAlta()).format("DD/MM/YYYY");
        }
        return f;
    });
    //-- llamadas
    self.llamadas = ko.observableArray();
    //-- canjes
    self.canjes = ko.observableArray();
    //-- puntos
    self.puntos_obtenidos = ko.observable();
    self.puntos_gastados = ko.observable();
    self.puntos_saldo = ko.observable();
    self.puntos_carro = ko.observable();
    self.puntos_saldo_carro = ko.observable();
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


function cargarMiembroDetalle(idMiembro) {
    // si la hay cargamos los datos del premio con el id pasado
    if (idMiembro) {
        // búsqueda del registro implicado
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/api/miembros_detalle/" + idMiembro,
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
                //
                vm.llamadas(data.llamadas);
                vm.canjes(data.canjes);
                vm.puntos_obtenidos(data.puntos[0].obtenidos);
                vm.puntos_gastados(data.puntos[0].gastados);
                vm.puntos_carro(data.puntos[0].carro);
                vm.puntos_saldo(data.puntos[0].saldo);
                vm.puntos_saldo_carro(data.puntos[0].saldo_carro);
                //
                dataLlamadas = vm.llamadas();
                loadTablaLlamadas();
                dataCanjes = vm.canjes();
                loadTablaCanjes();
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

function loadTablaLlamadas() {
    tablaLlamadas = $('#dataTableLlamadas').dataTable({
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
        data: dataLlamadas,
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
            data: "hora",
            class: "text-center"
        }, {
            data: "telefono",
        }]
    });
}

function loadTablaCanjes() {
    tablaCanjes = $('#dataTableCanjes').dataTable({
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
        data: dataCanjes,
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
        }]
    });
}