document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#painel-search-form");
  const input = document.querySelector("#painel-search-input");
  const filter = document.querySelector("#painel-pet-filter");
  const cards = [...document.querySelectorAll(".painel-pet-card")];
  const count = document.querySelector("#painel-pet-count");
  const empty = document.querySelector("#painel-no-pets");
  const normalize = s => (s || "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  function update() {
    const term = normalize(input.value); let visible = 0;
    cards.forEach(card => {
      const matches = (!term || normalize(`${card.dataset.name} ${card.dataset.search} ${card.textContent}`).includes(term)) && (filter.value === "todos" || card.dataset.kind === filter.value);
      card.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? "amigo" : "amigos"}`;
    empty.hidden = visible !== 0;
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const url = new URL("/pesquisar-animais/", window.location.origin);
    if (input.value.trim()) url.searchParams.set("q", input.value.trim());
    window.location.href = url.toString();
  });
  input.addEventListener("input", update);
  filter.addEventListener("change", update);
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault(); input.focus();
    }
    if (event.key === "Escape" && document.activeElement === input) {
      input.value = ""; update(); input.blur();
    }
  });
  document.querySelectorAll(".painel-favorite").forEach(button => button.addEventListener("click", () => {
    const saved = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(saved));
    button.textContent = saved ? "♥" : "♡";
    button.setAttribute("aria-label", `${saved ? "Remover dos favoritos" : "Favoritar"} ${button.closest(".painel-pet-card").dataset.name}`);
  }));
  update();
});
