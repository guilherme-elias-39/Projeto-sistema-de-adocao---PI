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
});