document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector(".agendamento-actions form");


    if (!formulario) {
        return;
    }


    formulario.addEventListener("submit", function (evento) {
        const confirmar = window.confirm(
            "Tem certeza de que deseja cancelar este agendamento?"
        );


        if (!confirmar) {
            evento.preventDefault();
        }
    });
});


