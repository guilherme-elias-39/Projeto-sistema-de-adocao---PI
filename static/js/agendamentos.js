document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".appointment-tab");

    const upcomingPanel = document.getElementById("panel-upcoming");
    const finishedPanel = document.getElementById("panel-finished");
    const emptyMessage = document.getElementById("appointments-empty");

    const upcomingCount = document.getElementById("upcoming-count");
    const finishedCount = document.getElementById("finished-count");

    const upcomingTabCount = document.getElementById("upcoming-tab-count");
    const finishedTabCount = document.getElementById("finished-tab-count");

    const totalLabel = document.getElementById("appointments-total");

    if (
        !tabs.length ||
        !upcomingPanel ||
        !finishedPanel ||
        !emptyMessage
    ) {
        return;
    }

    function updateCounts() {
        const upcomingCards = upcomingPanel.querySelectorAll(
            ".appointment-card"
        );

        const finishedCards = finishedPanel.querySelectorAll(
            ".appointment-card"
        );

        const upcomingTotal = upcomingCards.length;
        const finishedTotal = finishedCards.length;

        upcomingCount.textContent = upcomingTotal;
        finishedCount.textContent = finishedTotal;

        upcomingTabCount.textContent = upcomingTotal;
        finishedTabCount.textContent = finishedTotal;

        const total = upcomingTotal + finishedTotal;

        totalLabel.textContent =
            total + (total === 1 ? " agendamento" : " agendamentos");
    }

    function showTab(tabName) {
        const isUpcoming = tabName === "upcoming";

        upcomingPanel.hidden = !isUpcoming;
        finishedPanel.hidden = isUpcoming;

        const currentPanel = isUpcoming
            ? upcomingPanel
            : finishedPanel;

        const hasAppointments =
            currentPanel.querySelectorAll(".appointment-card").length > 0;

        emptyMessage.hidden = hasAppointments;

        tabs.forEach(function (tab) {
            const isActive = tab.dataset.tab === tabName;

            tab.classList.toggle("active", isActive);

            tab.setAttribute(
                "aria-selected",
                String(isActive)
            );

            tab.tabIndex = isActive ? 0 : -1;
        });
    }

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            showTab(tab.dataset.tab);
        });

        tab.addEventListener("keydown", function (event) {
            if (
                event.key === "ArrowRight" ||
                event.key === "ArrowLeft"
            ) {
                event.preventDefault();

                const currentIndex = Array.from(tabs).indexOf(tab);

                const direction = event.key === "ArrowRight" ? 1 : -1;

                const nextIndex =
                    (currentIndex + direction + tabs.length) % tabs.length;

                tabs[nextIndex].focus();
                showTab(tabs[nextIndex].dataset.tab);
            }
        });
    });

    updateCounts();
    showTab("upcoming");
});