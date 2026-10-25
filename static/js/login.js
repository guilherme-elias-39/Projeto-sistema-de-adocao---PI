document.addEventListener("DOMContentLoaded", () => {
    const password = document.getElementById("senha");
    const togglePassword = document.getElementById("toggle-password");

    // Mostrar ou ocultar a senha.
    if (togglePassword && password) {
        togglePassword.addEventListener("click", () => {
            const showingPassword = password.type === "password";

            password.type = showingPassword ? "text" : "password";

            togglePassword.setAttribute(
                "aria-label",
                showingPassword ? "Ocultar senha" : "Mostrar senha"
            );

            togglePassword.setAttribute(
                "aria-pressed",
                String(showingPassword)
            );
        });
    }


    // Validar os campos e redirecionar para a página inicial.
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (message) {
                message.textContent = "";
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const homeUrl = form.dataset.homeUrl;

            if (!homeUrl) {
                if (message) {
                    message.textContent =
                        "Não foi possível identificar a página inicial.";
                }
                return;
            }

            // Demonstração: não verifica a senha no servidor.
            window.location.assign(homeUrl);
        });
    }
});