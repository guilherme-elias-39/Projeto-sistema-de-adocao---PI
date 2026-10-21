document.addEventListener("DOMContentLoaded", function () {
    const cancelarBotao = document.getElementById("cancelar-agendamento");
    const status = document.getElementById("agendamento-status");
    const aviso = document.getElementById("agendamento-notice");
    const acoes = document.getElementById("agendamento-actions");
    const cancelado = document.getElementById("agendamento-cancelled");

    if (!cancelarBotao || !status || !aviso || !acoes || !cancelado) {
        return;
    }

    // Mantém a mensagem de cancelamento escondida ao carregar a página.
    cancelado.hidden = true;

    cancelarBotao.addEventListener("click", function () {
        const confirmar = window.confirm(
            "Tem certeza de que deseja cancelar o agendamento de Thor?"
        );

        // Se a pessoa desistir, nada será alterado.
        if (!confirmar) {
            return;
        }

        // Atualiza o status.
        status.innerHTML = '<span class="status-dot"></span> Cancelado';
        status.style.background = "#fff0ef";
        status.style.borderColor = "#edcccc";
        status.style.color = "#ad4545";

        const ponto = status.querySelector(".status-dot");

        if (ponto) {
            ponto.style.background = "#c45b5b";
        }

        // Oculta a confirmação e os botões anteriores.
        aviso.hidden = true;
        acoes.hidden = true;

        // Exibe a mensagem somente após confirmar o cancelamento.
        cancelado.hidden = false;
    });
});