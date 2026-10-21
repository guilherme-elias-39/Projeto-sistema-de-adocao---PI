/* =========================================
   MAJESTANIMAIS — MENSAGENS / CONVERSAS
   Arquivo: static/js/mensagens.js
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const workspace = document.querySelector(".messages-workspace");
    const conversationItems = Array.from(
        document.querySelectorAll(".conversation-item")
    );

    const conversationList = document.getElementById("conversation-list");
    const searchInput = document.getElementById("conversation-filter");
    const clearSearchButton = document.getElementById("clear-search");
    const filterButtons = Array.from(
        document.querySelectorAll(".filter-button")
    );

    const chatName = document.getElementById("chat-name");
    const chatAvatar = document.getElementById("chat-avatar");
    const chatMessages = document.getElementById("chat-messages");

    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");

    const noConversations = document.getElementById("no-conversations");
    const conversationTotal = document.getElementById("conversation-total");
    const unreadTotal = document.getElementById("unread-total");

    const mobileBackButton = document.getElementById("mobile-back");

    if (!workspace || !conversationList || !messageForm) {
        return;
    }

    let currentConversation = "patinhas";
    let currentFilter = "all";

    /*
     * Mensagens demonstrativas.
     *
     * Posteriormente, esses dados poderão ser substituídos
     * pelas mensagens recuperadas do banco de dados Django.
     */

    const conversations = {
        patinhas: {
            name: "Patinhas Felizes",
            photo: getConversationPhoto("patinhas"),
            unread: 2,
            messages: [
                {
                    text: "Olá! Tudo bem? 🐾",
                    time: "10:20",
                    sent: false
                },
                {
                    text: "Temos alguns filhotes disponíveis para adoção. Você gostaria de conhecê-los?",
                    time: "10:24",
                    sent: false
                },
                {
                    text: "Olá! Gostaria, sim. Poderiam me enviar mais informações?",
                    time: "10:26",
                    sent: true
                }
            ]
        },

        esperanca: {
            name: "Esperança Animal",
            photo: getConversationPhoto("esperanca"),
            unread: 0,
            messages: [
                {
                    text: "Olá! Agradecemos pelo seu interesse em nossos animais.",
                    time: "Ontem",
                    sent: false
                },
                {
                    text: "Gostaria de saber mais sobre o processo de adoção.",
                    time: "Ontem",
                    sent: true
                },
                {
                    text: "Pode ser sim! 😊",
                    time: "Ontem",
                    sent: false
                }
            ]
        },

        vida: {
            name: "Vida Animal",
            photo: getConversationPhoto("vida"),
            unread: 0,
            messages: [
                {
                    text: "Olá! Gostaria de conhecer os animais disponíveis para adoção.",
                    time: "Ontem",
                    sent: true
                },
                {
                    text: "Obrigada pelo interesse!",
                    time: "Ontem",
                    sent: false
                }
            ]
        },

        amor: {
            name: "Amor de 4 Patas",
            photo: getConversationPhoto("amor"),
            unread: 0,
            messages: [
                {
                    text: "Olá! Vocês têm mais informações sobre esse animal?",
                    time: "Seg.",
                    sent: true
                },
                {
                    text: "Enviamos mais informações sobre o animal.",
                    time: "Seg.",
                    sent: false
                }
            ]
        },

        adotar: {
            name: "Projeto Adotar",
            photo: getConversationPhoto("adotar"),
            unread: 0,
            messages: [
                {
                    text: "Podemos agendar uma visita para amanhã?",
                    time: "Seg.",
                    sent: true
                },
                {
                    text: "Tudo certo! Até amanhã.",
                    time: "Seg.",
                    sent: false
                }
            ]
        }
    };

    /*
     * Recupera a foto da conversa presente no HTML.
     */

    function getConversationPhoto(id) {
        const item = conversationItems.find(function (conversation) {
            return conversation.dataset.conversation === id;
        });

        if (!item) {
            return "";
        }

        const image = item.querySelector(".conversation-avatar img");

        return image ? image.getAttribute("src") : "";
    }

    /*
     * Escapa caracteres especiais antes de inserir
     * textos nas prévias das conversas.
     */

    function escapeHTML(text) {
        const element = document.createElement("span");

        element.textContent = text;

        return element.innerHTML;
    }

    /*
     * Formata a hora da mensagem.
     */

    function getCurrentTime() {
        return new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date());
    }

    /*
     * Atualiza os indicadores de conversas.
     */

    function updateCounters() {
        const visibleItems = conversationItems.filter(function (item) {
            return !item.hidden;
        });

        const unreadCount = conversationItems.reduce(
            function (total, item) {
                const conversation =
                    conversations[item.dataset.conversation];

                if (conversation && conversation.unread > 0) {
                    return total + conversation.unread;
                }

                return total;
            },
            0
        );

        conversationTotal.textContent =
            visibleItems.length +
            (visibleItems.length === 1 ? " conversa" : " conversas");

        unreadTotal.textContent =
            unreadCount +
            (unreadCount === 1 ? " nova" : " novas");

        unreadTotal.hidden = unreadCount === 0;
    }

    /*
     * Atualiza o indicador de mensagens não lidas
     * em cada conversa.
     */

    function updateUnreadBadge(id) {
        const item = conversationItems.find(function (conversation) {
            return conversation.dataset.conversation === id;
        });

        const conversation = conversations[id];

        if (!item || !conversation) {
            return;
        }

        item.dataset.unread =
            conversation.unread > 0 ? "true" : "false";

        let badge = item.querySelector(".unread-badge");

        if (conversation.unread > 0) {
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "unread-badge";
                item.appendChild(badge);
            }

            badge.textContent = conversation.unread;

            badge.setAttribute(
                "aria-label",
                conversation.unread +
                    (conversation.unread === 1
                        ? " mensagem não lida"
                        : " mensagens não lidas")
            );
        } else if (badge) {
            badge.remove();
        }
    }

    /*
     * Atualiza a prévia e o horário da conversa
     * depois do envio de uma mensagem.
     */

    function updateConversationPreview(id, text, time) {
        const item = conversationItems.find(function (conversation) {
            return conversation.dataset.conversation === id;
        });

        if (!item) {
            return;
        }

        const preview = item.querySelector(".conversation-preview");
        const timeElement = item.querySelector(".conversation-topline time");

        if (preview) {
            preview.textContent = text;
        }

        if (timeElement) {
            timeElement.textContent = time;
        }
    }

    /*
     * Cria um balão de mensagem sem inserir
     * o conteúdo do usuário diretamente como HTML.
     */

    function createMessage(message) {
        const article = document.createElement("article");

        article.className = message.sent
            ? "message sent"
            : "message received";

        const bubble = document.createElement("div");

        bubble.className = "message-bubble";

        const paragraph = document.createElement("p");

        paragraph.textContent = message.text;

        const time = document.createElement("time");

        time.textContent = message.time;

        bubble.appendChild(paragraph);
        bubble.appendChild(time);

        if (message.sent) {
            const status = document.createElement("span");

            status.className = "message-status";
            status.textContent = "✓✓";
            status.setAttribute("aria-label", "Enviada");

            bubble.appendChild(status);
        }

        article.appendChild(bubble);

        return article;
    }

    /*
     * Exibe as mensagens da conversa selecionada.
     */

    function renderMessages(id) {
        const conversation = conversations[id];

        if (!conversation) {
            return;
        }

        chatMessages.replaceChildren();

        const dateDivider = document.createElement("div");

        dateDivider.className = "chat-date-divider";

        const dateLabel = document.createElement("span");

        dateLabel.textContent = "Histórico da conversa";

        dateDivider.appendChild(dateLabel);
        chatMessages.appendChild(dateDivider);

        conversation.messages.forEach(function (message) {
            chatMessages.appendChild(createMessage(message));
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /*
     * Seleciona uma conversa e atualiza o painel.
     */

    function selectConversation(id) {
        const conversation = conversations[id];

        if (!conversation) {
            return;
        }

        currentConversation = id;

        conversationItems.forEach(function (item) {
            const selected =
                item.dataset.conversation === id;

            item.classList.toggle("active", selected);

            item.setAttribute(
                "aria-pressed",
                selected ? "true" : "false"
            );
        });

        chatName.textContent = conversation.name;

        const avatarImage = chatAvatar.querySelector("img");

        if (avatarImage) {
            avatarImage.src = conversation.photo;
            avatarImage.alt = "";
        }

        /*
         * Ao abrir uma conversa, suas mensagens
         * demonstrativas são marcadas como lidas.
         */

        conversation.unread = 0;

        updateUnreadBadge(id);
        updateCounters();

        renderMessages(id);

        workspace.classList.add("chat-open");

        messageInput.focus({
            preventScroll: true
        });
    }

    /*
     * Pesquisa por nome da ONG ou conteúdo
     * da última mensagem.
     */

    function filterConversations() {
        const searchTerm = searchInput.value
            .trim()
            .toLocaleLowerCase("pt-BR");

        let visibleCount = 0;

        conversationItems.forEach(function (item) {
            const id = item.dataset.conversation;
            const conversation = conversations[id];

            if (!conversation) {
                item.hidden = true;
                return;
            }

            const lastMessage =
                conversation.messages[
                    conversation.messages.length - 1
                ];

            const searchText = (
                conversation.name +
                " " +
                (lastMessage ? lastMessage.text : "")
            ).toLocaleLowerCase("pt-BR");

            const matchesSearch =
                searchText.includes(searchTerm);

            const matchesFilter =
                currentFilter === "all" ||
                conversation.unread > 0;

            const visible = matchesSearch && matchesFilter;

            item.hidden = !visible;

            if (visible) {
                visibleCount++;
            }
        });

        noConversations.hidden = visibleCount !== 0;

        clearSearchButton.hidden = searchInput.value.length === 0;

        updateCounters();
    }

    /*
     * Clique em uma conversa.
     */

    conversationItems.forEach(function (item) {
        item.addEventListener("click", function () {
            selectConversation(item.dataset.conversation);
        });
    });

    /*
     * Busca de conversas.
     */

    searchInput.addEventListener("input", function () {
        filterConversations();
    });

    clearSearchButton.addEventListener("click", function () {
        searchInput.value = "";

        filterConversations();

        searchInput.focus();
    });

    /*
     * Filtro: todas ou não lidas.
     */

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            currentFilter = button.dataset.filter;

            filterButtons.forEach(function (filterButton) {
                const selected =
                    filterButton === button;

                filterButton.classList.toggle("active", selected);

                filterButton.setAttribute(
                    "aria-pressed",
                    selected ? "true" : "false"
                );
            });

            filterConversations();
        });
    });

    /*
     * Envio de mensagem demonstrativa.
     */

/*
 * Envio de mensagem com resposta automática do agente virtual.
 */

messageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (!text) {
        messageInput.focus();
        return;
    }

    const conversation = conversations[currentConversation];

    if (!conversation) {
        return;
    }

    const time = getCurrentTime();

    // 1. Cria a mensagem enviada pelo usuário.
    const newMessage = {
    text: text,
    time: time,
    sent: true,
    conversationId: currentConversation
    };

    conversation.messages.push(newMessage);

    chatMessages.appendChild(createMessage(newMessage));

    chatMessages.scrollTop = chatMessages.scrollHeight;

    updateConversationPreview(
        currentConversation,
        text,
        time
    );

    // 2. Coloca a conversa no início da lista.
    const currentItem = conversationItems.find(function (item) {
        return item.dataset.conversation === currentConversation;
    });

    if (currentItem) {
        conversationList.prepend(currentItem);
    }

    // 3. Limpa o campo de digitação.
    messageInput.value = "";
    messageInput.style.height = "auto";

    filterConversations();

    messageInput.focus();

    // 4. Define a resposta automática do agente virtual.
    const automaticResponse =
        "Olá! 🐾 Agradecemos por entrar em contato conosco. " +
        "Sua mensagem foi recebida com sucesso! Nossa equipe " +
        "analisará sua solicitação e responderá assim que possível. " +
        "Enquanto isso, fique à vontade para conhecer nossos " +
        "animais disponíveis para adoção!";

    // 5. Aguarda 1,5 segundo antes de responder.
    setTimeout(function () {
        const targetConversation = conversations[
            newMessage.conversationId
        ];

        if (!targetConversation) {
            return;
        }

        const replyTime = getCurrentTime();

        // 6. Cria a resposta automática.
        const reply = {
            text: automaticResponse,
            time: replyTime,
            sent: false
        };

        targetConversation.messages.push(reply);

        /*
         * Atualiza o histórico somente se a conversa
         * que recebeu a resposta ainda estiver aberta.
         */
        if (currentConversation === newMessage.conversationId) {
            chatMessages.appendChild(createMessage(reply));
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // 7. Atualiza a prévia da conversa na barra lateral.
        updateConversationPreview(
            newMessage.conversationId,
            automaticResponse,
            replyTime
        );

        filterConversations();

    }, 1500);
    });

    /*
     * Enter envia a mensagem.
     * Shift + Enter cria uma nova linha.
     */

    messageInput.addEventListener("keydown", function (event) {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.isComposing
        ) {
            event.preventDefault();

            messageForm.requestSubmit();
        }
    });

    /*
     * Ajusta a altura do campo de texto
     * de acordo com o conteúdo digitado.
     */

    messageInput.addEventListener("input", function () {
        messageInput.style.height = "auto";

        messageInput.style.height =
            Math.min(messageInput.scrollHeight, 120) + "px";
    });

    /*
     * Volta à lista de conversas em telas pequenas.
     */

    mobileBackButton.addEventListener("click", function () {
        workspace.classList.remove("chat-open");
    });

    /*
     * Inicialização.
     */

    conversationItems.forEach(function (item) {
        updateUnreadBadge(item.dataset.conversation);
    });

    updateCounters();

    filterConversations();

    selectConversation(currentConversation);
});