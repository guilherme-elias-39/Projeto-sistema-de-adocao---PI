document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("ngo-search");
    const clearButton = document.getElementById("ngo-clear");
    const resultsContainer = document.getElementById("ngo-results");
    const countElement = document.getElementById("ngo-count");
    const emptyMessage = document.getElementById("ngo-empty");

    if (
        !searchInput ||
        !clearButton ||
        !resultsContainer ||
        !countElement ||
        !emptyMessage
    ) {
        console.error("Elementos da pesquisa de ONGs não encontrados.");
        return;
    }

    const cards = Array.from(
        resultsContainer.querySelectorAll(".ngo-card")
    );

    // Normaliza o texto para ignorar diferenças entre maiúsculas,
    // minúsculas e acentos.
    function normalizar(texto) {
        return texto
            .toLocaleLowerCase("pt-BR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function pesquisarONGs() {
        const termo = normalizar(searchInput.value);
        let quantidade = 0;

        cards.forEach(function (card) {
            const dados = normalizar(
                card.getAttribute("data-search") || ""
            );

            const encontrado = dados.includes(termo);

            card.hidden = !encontrado;

            if (encontrado) {
                quantidade++;
            }
        });

        countElement.textContent =
            quantidade +
            (quantidade === 1
                ? " resultado"
                : " resultados");

        emptyMessage.hidden = quantidade !== 0;

        clearButton.hidden = searchInput.value.length === 0;
    }

    searchInput.addEventListener("input", pesquisarONGs);

    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        pesquisarONGs();
        searchInput.focus();
    });

    pesquisarONGs();
});