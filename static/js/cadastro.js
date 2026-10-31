document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastro-form");
    const cpf = document.getElementById("cpf");
    const senha = document.getElementById("senha");
    const confirmarSenha = document.getElementById("confirmar-senha");

    const cpfErro = document.getElementById("cpf-erro");
    const senhaErro = document.getElementById("senha-erro");
    const mensagem = document.getElementById("cadastro-mensagem");

    // Mostrar e ocultar senhas.
    document.querySelectorAll(".cadastro-ver-senha").forEach((button) => {
        button.addEventListener("click", () => {
            const input = document.getElementById(
                button.dataset.password
            );

            if (!input) return;

            const mostrar = input.type === "password";
            input.type = mostrar ? "text" : "password";

            button.setAttribute(
                "aria-pressed",
                String(mostrar)
            );

            button.setAttribute(
                "aria-label",
                mostrar ? "Ocultar senha" : "Mostrar senha"
            );
        });
    });

    // Formatar CPF: 000.000.000-00.
    if (cpf) {
        cpf.addEventListener("input", () => {
            let valor = cpf.value.replace(/\D/g, "").slice(0, 11);

            valor = valor
                .replace(/^(\d{3})(\d)/, "$1.$2")
                .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1-$2");

            cpf.value = valor;

            if (cpfErro) cpfErro.textContent = "";
            if (mensagem) mensagem.textContent = "";
        });
    }

    // Validar os dígitos verificadores do CPF.
    function cpfValido(valor) {
        const numeros = valor.replace(/\D/g, "");

        if (numeros.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(numeros)) return false;

        let soma = 0;

        for (let i = 0; i < 9; i++) {
            soma += Number(numeros[i]) * (10 - i);
        }

        let resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;

        if (resto !== Number(numeros[9])) return false;

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma += Number(numeros[i]) * (11 - i);
        }

        resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;

        return resto === Number(numeros[10]);
    }

    // Validar confirmação de senha enquanto digita.
    function validarSenhas() {
        const iguais = senha.value === confirmarSenha.value;

        if (senhaErro) {
            senhaErro.textContent =
                confirmarSenha.value && !iguais
                    ? "As senhas não coincidem."
                    : "";
        }

        confirmarSenha.setCustomValidity(
            iguais ? "" : "As senhas não coincidem."
        );

        return iguais;
    }

    senha.addEventListener("input", validarSenhas);
    confirmarSenha.addEventListener("input", validarSenhas);

    // Validar antes de enviar ao servidor.
    form.addEventListener("submit", (event) => {
        if (mensagem) mensagem.textContent = "";
        if (cpfErro) cpfErro.textContent = "";

        if (!form.checkValidity()) {
            event.preventDefault();
            form.reportValidity();
            return;
        }

        if (!cpfValido(cpf.value)) {
            event.preventDefault();

            if (cpfErro) {
                cpfErro.textContent = "Digite um CPF válido.";
            }

            cpf.focus();
            return;
        }

        if (!validarSenhas()) {
            event.preventDefault();
            confirmarSenha.reportValidity();
            return;
        }

        // Se os dados forem válidos, o formulário será enviado
        // para a view Django definida no atributo action.
    
            });
});