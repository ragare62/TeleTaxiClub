// teletaxi_club.js

// gup stands from Get Url Parameters
function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return results[1];
}

// función general para mostrar mensajes de error de AJAX

var errorAjax = function(xhr, textStatus, errorThrwon) {
    var m = xhr.responseText;
    if (!m) m = "Error general posiblemente falla la conexión";
    bootbox.alert("<span class='text-danger'>ERROR:</span><br/>" + m, function() {});
}

// funcion general para el formateo de fechas.
    function formatDate(date) {
        if (!date) {
            return "";
        }
        if (!moment(date).isValid()) {
            return "";
        }
        return moment(date).format("DD/MM/YYYY");
    }