// Funciones de soporte a las páginas
// miembros.html

// declaración general de variables
var tablaResumen;
var dataResumen;
var dataCurrentYear = [];
var dataCurrentYearAcum = [];
var vm;

//------------ miembros.html

function initResumen() {
    loadResumen();
}


function loadResumen() {
    $.ajax({
        type: "GET",
        url: "../api/estadisticas/numllamadas/" + moment().format("YYYY"),
        dataType: "json",
        success: function(resumen, textStatus) {
            dataResumen = resumen;
            calcDataYear(resumen);
            //loadTablaMiembros();
            cargarGraficos(dataResumen);
            $('#loader').hide();
        },
        error: errorAjax
    });
}

function cargarGraficos(data) {
    Morris.Line({
        element: 'morris-area-chart',
        data: data,
        xkey: 'lk',
        ykeys: ['numtotal', 'numclien', 'numclub'],
        labels: ['Servicios', 'Clientes', 'Club'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
    Morris.Line({
        element: 'morris-area-chart-ano',
        data: dataCurrentYear,
        xkey: 'lk',
        ykeys: ['numtotal', 'numclien', 'numclub'],
        labels: ['Servicios', 'Clientes', 'Club'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
    Morris.Donut({
        element: 'morris-donut-chart',
        data: dataCurrentYearAcum,
        resize: true
    });
}

function calcDataYear(data) {
    // acumuladores
    var totLlamadas = 0;
    var totClientes = 0;
    var totClub = 0;
    // año actual
    var year = moment().format("YYYY");
    data.forEach(function(e) {
        if (e.lk.indexOf(year) > -1) {
            dataCurrentYear.push({
                lk: e.lk,
                numtotal: e.numtotal,
                numclien: e.numclien,
                numclub: e.numclub
            });
            totLlamadas += e.numtotal;
            totClientes += e.numclien;
            totClub += e.numclub;
        }
    });
    dataCurrentYearAcum = [{
        label: "Total",
        value: totLlamadas
    }, {
        label: "Clientes",
        value: totClientes
    }, {
        label: "Club",
        value: totClub
    }];
}


function loadTablaResumen() {
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
        data: dataResumen,
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