document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("painel-search-form");
  const searchInput = document.getElementById("painel-search-input");
  const searchType = document.getElementById("painel-search-type");

  // Encaminha a busca para a página correta sem depender de caminhos fixos.
  form?.addEventListener("submit", (event) => {
    if (!searchType) return;
    event.preventDefault();
    const target = searchType.value === "ongs"
      ? form.dataset.ongsUrl
      : form.dataset.animalsUrl;
    const fallback = searchType.value === "ongs"
      ? "/pesquisa-instituicoes/"
      : "/pesquisa-pets/";
    const url = new URL(target || fallback, window.location.origin);
    const query = searchInput?.value.trim();
    if (query) url.searchParams.set("q", query);
    window.location.href = url.toString();
  });

  // Atalho Ctrl/Cmd + K para focar a busca.
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput?.focus();
    }
    if (event.key === "Escape" && document.activeElement === searchInput) {
      searchInput.blur();
    }
  });

   // Filtro de animais por espécie.
  const filter = document.getElementById("painel-pet-filter");
  const cards = [...document.querySelectorAll(".painel-pet-card")];
  const count = document.getElementById("painel-pet-count");
  const empty = document.getElementById("painel-no-pets");

  function applyFilter() {
    const selected = filter?.value || "todos";
    let visible = 0;

    cards.forEach((card) => {
      const kind = (card.dataset.kind || "").toLowerCase();
      const show = selected === "todos" || kind === selected;

      card.hidden = !show;

      if (show) visible++;
    });

    if (count) {
      count.textContent = `${visible} ${visible === 1 ? "amigo" : "amigos"}`;
    }

    if (empty) {
      empty.hidden = visible !== 0;
    }
  }

  filter?.addEventListener("change", applyFilter);
  applyFilter();
});