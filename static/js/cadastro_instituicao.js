document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("cadastro-ong-form");

    if (!form) return;

    // Campos do formulário
    const cnpj = document.getElementById("cnpj");
    const cnpjErro = document.getElementById("cnpj-erro");

    const email = document.getElementById("email");
    const telefone = document.getElementById("telefone");

    const descricao = document.getElementById("descricao");
    const contagem = document.getElementById("descricao-contagem");

    const mensagem = document.getElementById("cadastro-ong-erro");
    const botao = document.getElementById("cadastro-ong-submit");


    // =====================================
    // FORMATAÇÃO DO CNPJ
    // =====================================

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


    // =====================================
    // VALIDAÇÃO DO CNPJ
    // =====================================

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


    // =====================================
    // CONTADOR DA DESCRIÇÃO
    // =====================================

    function atualizarContagem() {

        contagem.textContent = descricao.value.length;

    }

    descricao.addEventListener("input", () => {

        atualizarContagem();
        mensagem.textContent = "";

    });

    atualizarContagem();


    // =====================================
    // VALIDAÇÃO DO E-MAIL
    // =====================================

    function emailValido(valor) {

        if (!valor.trim()) return true;

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());

    }


    // =====================================
    // VALIDAÇÃO DO TELEFONE
    // =====================================

    function telefoneValido(valor) {

        if (!valor.trim()) return true;

        const numeros = valor.replace(/\D/g, "");

        return numeros.length === 10 || numeros.length === 11;

    }


    // =====================================
    // LIMPAR MENSAGENS AO EDITAR
    // =====================================

    email.addEventListener("input", () => {
        mensagem.textContent = "";
    });

    telefone.addEventListener("input", () => {
        mensagem.textContent = "";
    });


    // =====================================
    // ENVIO DO FORMULÁRIO
    // =====================================

    form.addEventListener("submit", (event) => {

        cnpjErro.textContent = "";
        mensagem.textContent = "";

        // Verifica os campos obrigatórios do HTML
        if (!form.checkValidity()) {

            event.preventDefault();

            form.reportValidity();

            return;
        }


        // Valida CNPJ
        if (!cnpjValido(cnpj.value)) {

            event.preventDefault();

            cnpjErro.textContent = "Informe um CNPJ válido.";

            cnpj.focus();

            return;
        }


        // Valida e-mail
        if (!emailValido(email.value)) {

            event.preventDefault();

            mensagem.textContent = "Informe um e-mail válido.";

            email.focus();

            return;
        }


        // Valida telefone
        if (!telefoneValido(telefone.value)) {

            event.preventDefault();

            mensagem.textContent =
                "Informe um telefone válido com DDD.";

            telefone.focus();

            return;
        }


        // Evita envios repetidos
        botao.disabled = true;

        botao.textContent = "Enviando...";

    });

});