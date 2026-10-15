document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastro-ong-form");

    if (!form) return;

    const cnpj = document.getElementById("cnpj");
    const cnpjErro = document.getElementById("cnpj-erro");
    const contato = document.getElementById("contato");
    const contatoErro = document.getElementById("contato-erro");
    const descricao = document.getElementById("descricao");
    const contagem = document.getElementById("descricao-contagem");
    const mensagem = document.getElementById("cadastro-ong-erro");
    const botao = document.getElementById("cadastro-ong-submit");

    // Formata o CNPJ: 00.000.000/0000-00.
    cnpj.addEventListener("input", () => {
        let valor = cnpj.value.replace(/\D/g, "").slice(0, 14);

        valor = valor
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");

        cnpj.value = valor;
        cnpjErro.textContent = "";
        mensagem.textContent = "";
    });

    // Validação do CNPJ numérico tradicional.
    function cnpjValido(valor) {
        const numeros = valor.replace(/\D/g, "");

        if (numeros.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(numeros)) return false;

        const calcularDigito = (base, pesos) => {
            const soma = base
                .split("")
                .reduce(
                    (total, numero, indice) =>
                        total + Number(numero) * pesos[indice],
                    0
                );

            const resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        };

        const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        const primeiro = calcularDigito(
            numeros.slice(0, 12),
            pesos1
        );

        if (primeiro !== Number(numeros[12])) return false;

        const segundo = calcularDigito(
            numeros.slice(0, 13),
            pesos2
        );

        return segundo === Number(numeros[13]);
    }

    // Atualiza a contagem da descrição.
    descricao.addEventListener("input", () => {
        contagem.textContent = descricao.value.length;
        mensagem.textContent = "";
    });

    // Limpa mensagens ao editar o contato.
    contato.addEventListener("input", () => {
        contatoErro.textContent = "";
        mensagem.textContent = "";
    });

    function contatoValido(valor) {
        const texto = valor.trim();

        // E-mail.
        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);

        // Telefone brasileiro com DDD, com ou sem formatação.
        const numeros = texto.replace(/\D/g, "");
        const telefoneValido =
            numeros.length >= 10 && numeros.length <= 13;

        return emailValido || telefoneValido;
    }

    form.addEventListener("submit", (event) => {
        cnpjErro.textContent = "";
        contatoErro.textContent = "";
        mensagem.textContent = "";

        if (!form.checkValidity()) {
            event.preventDefault();
            form.reportValidity();
            return;
        }

        if (!cnpjValido(cnpj.value)) {
            event.preventDefault();
            cnpjErro.textContent = "Informe um CNPJ válido.";
            cnpj.focus();
            return;
        }

        if (!contatoValido(contato.value)) {
            event.preventDefault();
            contatoErro.textContent =
                "Informe um e-mail válido ou telefone com DDD.";
            contato.focus();
            return;
        }

        // Evita cliques repetidos enquanto o formulário é enviado.
        // A view do Django ainda precisa validar e salvar os dados.
        botao.disabled = true;
        botao.textContent = "Enviando...";
    });
});