// Funciones de soporte a las páginas
// miembros.html

// declaración general de variables
var tablaMiembros;
var dataMiembros;
var vm;

//------------ miembros.html

function initMiembros() {
    loadMiembros();
}

function editMiembro(idMiembro) {
    // hay que abrir la página de premio
    // pasando en la url ese ID
    var url = "miembro.html?idMiembro=" + idMiembro;
    window.open(url, '_self');
};

function loadMiembros() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/miembros",
        dataType: "json",
        success: function(miembros, textStatus) {
            dataMiembros = miembros;
            loadTablaMiembros();
        },
        error: errorAjax
    });
}

function loadTablaMiembros() {
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
        data: dataMiembros,
        columns: [{
            data: "nombre",
            render: function(data, type, row, meta) {
                var nc = "";
                nc += row.primerApellido;
                if (row.segundoApellido) {
                    nc += " " + row.segundoApellido;
                }
                nc += ", " + row.nombre;
                return nc;
            }
        }, {
            data: "email"
        }, {
            data: "telefono1"
        }, {
            data: "telefono2"
        }, {
            data: "telefono3"
        }, {
            data: "telefono4"
        }, {
            data: "telefono5"
        }, {
            data: "fechaAlta",
            render: function(data) {
                // controlamos que si la fecha es nula no se muestre
                if (moment(data).isValid())
                    return moment(data).format('DD/MM/YYYY');
                else
                    return "";
            }
        }, {
            data: "idMiembro",
            render: function(data) {
                var bt1 = "<button class='btn btn-primary' onclick='editMiembro(" + data + ");'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class'text-center'> " + bt1 + "</div>"
                return html;
            }
        }]
    });
}

//------------ premio.html