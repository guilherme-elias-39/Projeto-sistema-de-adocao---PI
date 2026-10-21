/* =========================================
   MAJESTANIMAIS — PERFIL DO USUÁRIO
   Arquivo: static/core/js/perfil_usuario.js
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const menuItems = Array.from(
        document.querySelectorAll(".profile-menu-item[data-section]")
    );

    const sections = Array.from(
        document.querySelectorAll(".profile-section")
    );

    const profileForm = document.getElementById("profile-form");
    const profileFeedback = document.getElementById("profile-feedback");

    const settingsFeedback = document.getElementById("settings-feedback");

    const logoutButton = document.getElementById("logout-button");
    const logoutDialog = document.getElementById("logout-dialog");
    const cancelLogoutButton = document.getElementById("cancel-logout");

    const notificationsToggle = document.getElementById(
        "notifications-toggle"
    );

    const privacyToggle = document.getElementById("privacy-toggle");

    /*
     * NAVEGAÇÃO ENTRE AS SEÇÕES
     */

    function showSection(sectionName) {

        const targetSection = document.getElementById(
            "section-" + sectionName
        );

        if (!targetSection) {
            return;
        }

        sections.forEach(function (section) {

            const selected = section === targetSection;

            section.hidden = !selected;
            section.classList.toggle("active", selected);

        });

        menuItems.forEach(function (item) {

            const selected = item.dataset.section === sectionName;

            item.classList.toggle("active", selected);

            if (selected) {
                item.setAttribute("aria-current", "page");
            } else {
                item.removeAttribute("aria-current");
            }

        });

        /*
         * Em telas menores, leva o conteúdo selecionado
         * para uma posição visível.
         */

        if (window.matchMedia("(max-width: 760px)").matches) {

            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }

    menuItems.forEach(function (item) {

        item.addEventListener("click", function () {

            showSection(item.dataset.section);

        });

    });

    /*
     * FORMULÁRIO DE DADOS
     *
     * Nesta versão, o formulário valida os campos
     * no navegador, mas não salva os dados no Django.
     */

    if (profileForm) {

        profileForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!profileForm.checkValidity()) {

                profileForm.reportValidity();

                return;
            }

            profileFeedback.textContent =
                "Os campos estão válidos, mas as alterações ainda não foram salvas no servidor.";

        });

        profileForm.addEventListener("reset", function () {

            profileFeedback.textContent = "";

        });

    }

    /*
     * PREFERÊNCIAS DEMONSTRATIVAS
     *
     * Os valores ficam salvos no armazenamento local
     * deste navegador, neste dispositivo.
     */

    const preferenceKeys = {
        notifications: "majestanimais_profile_notifications",
        privacy: "majestanimais_profile_privacy"
    };

    function loadPreference(key, defaultValue) {

        const savedValue = localStorage.getItem(key);

        if (savedValue === null) {
            return defaultValue;
        }

        return savedValue === "true";

    }

    function savePreference(key, value) {

        localStorage.setItem(key, String(value));

    }

    function loadSettings() {

        notificationsToggle.checked = loadPreference(
            preferenceKeys.notifications,
            true
        );

        privacyToggle.checked = loadPreference(
            preferenceKeys.privacy,
            false
        );

    }

    function updateSettingsFeedback() {

        settingsFeedback.textContent =
            "Preferências atualizadas neste navegador.";

    }

    notificationsToggle.addEventListener("change", function () {

        savePreference(
            preferenceKeys.notifications,
            notificationsToggle.checked
        );

        updateSettingsFeedback();

    });

    privacyToggle.addEventListener("change", function () {

        savePreference(
            preferenceKeys.privacy,
            privacyToggle.checked
        );

        updateSettingsFeedback();

    });

    /*
     * CONFIRMAÇÃO DE SAÍDA
     */

    if (logoutButton && logoutDialog) {

        logoutButton.addEventListener("click", function () {

            if (typeof logoutDialog.showModal === "function") {

                logoutDialog.showModal();

            } else {

                const confirmLogout = window.confirm(
                    "Deseja sair da sua conta?"
                );

                if (confirmLogout) {
                    window.location.href = "/logout/";
                }

            }

        });

        cancelLogoutButton.addEventListener("click", function () {

            logoutDialog.close();

            logoutButton.focus();

        });

        /*
         * Fechar ao clicar fora da caixa de diálogo.
         */

        logoutDialog.addEventListener("click", function (event) {

            if (event.target === logoutDialog) {

                logoutDialog.close();

                logoutButton.focus();

            }

        });

    }

    /*
     * INICIALIZAÇÃO
     */

    loadSettings();

    showSection("dados");

});