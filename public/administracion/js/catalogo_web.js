// Funciones de soporte a las páginas
// catalogoA.html
// premio.html

// declaración general de variables
var tablaPremios;
var dataPremios;
var vm;


function initCatalogo() {
    vm = new modelCatalogo();
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
            ko.applyBindings(vm);
        },
        error: errorAjax
    });
}


function modelCatalogo() {
    var self = this;
    self.premios = ko.observableArray([]);
}

function formatLinkImage(name) {
    return '../images/' + name;
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