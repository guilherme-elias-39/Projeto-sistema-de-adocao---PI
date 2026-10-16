(() => {
    "use strict";

    const searchInput = document.getElementById("result-search");
    const clearButton = document.getElementById("clear-search");
    const tabs = Array.from(document.querySelectorAll(".search-tab"));
    const panels = {
        animals: document.getElementById("animals-panel"),
        ngos: document.getElementById("ngos-panel")
    };

    if (!searchInput || !clearButton || !tabs.length) return;

    let activeTab = "animals";

    const normalize = (value) => (value || "")
        .toLocaleLowerCase("pt-BR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    function filterPanel(type) {
        const panel = panels[type];
        if (!panel) return;

        const cards = Array.from(panel.querySelectorAll(".result-card"));
        const emptyState = document.getElementById(`${type}-empty`);
        const count = document.getElementById(`${type}-count`);
        const query = normalize(searchInput.value);
        let visible = 0;

        cards.forEach((card) => {
            const searchable = normalize(`${card.dataset.search || ""} ${card.textContent}`);
            const matches = !query || searchable.includes(query);
            card.hidden = !matches;
            if (matches) visible += 1;
        });

        if (count) {
            count.textContent = `${visible} ${visible === 1 ? "resultado" : "resultados"}`;
        }
        if (emptyState) emptyState.hidden = visible !== 0;
    }

    function setTab(type) {
        if (!panels[type]) return;
        activeTab = type;

        tabs.forEach((tab) => {
            const selected = tab.dataset.tab === type;
            tab.classList.toggle("is-active", selected);
            tab.setAttribute("aria-selected", String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });

        Object.entries(panels).forEach(([key, panel]) => {
            panel.hidden = key !== type;
        });

        filterPanel(type);
    }

    searchInput.addEventListener("input", () => {
        clearButton.classList.toggle("is-visible", searchInput.value.length > 0);
        filterPanel(activeTab);
    });

    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        clearButton.classList.remove("is-visible");
        filterPanel(activeTab);
        searchInput.focus();
    });

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => setTab(tab.dataset.tab));
        tab.addEventListener("keydown", (event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            const next = event.key === "ArrowRight" ? "ngos" : "animals";
            setTab(next);
            const nextTab = tabs.find((item) => item.dataset.tab === next);
            if (nextTab) nextTab.focus();
        });
    });

    filterPanel("animals");
    filterPanel("ngos");
    setTab("animals");
})();
