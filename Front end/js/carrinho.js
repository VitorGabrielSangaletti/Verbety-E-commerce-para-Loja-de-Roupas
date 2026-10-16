const API = "http://localhost:8080";

function formatarPreco(valor) {
    return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

async function carregarCarrinho() {
    const container = document.getElementById("itensCarrinho");
    const resumo = document.getElementById("resumo");
    const mensagem = document.getElementById("mensagem");

    const resposta = await fetch(API + "/api/carrinho", { credentials: "include" });

    // sem login vai pro login; admin nao tem carrinho (avisa e fica na pagina)
    if (resposta.status === 401) {
        const me = await fetch(API + "/api/auth/me", { credentials: "include" })
            .then(r => r.json()).catch(() => ({}));
        if (me.tipo === "ADMIN") {
            container.innerHTML = "";
            resumo.innerHTML = "";
            mensagem.textContent = "Apenas clientes podem ter carrinho. Saia e entre como cliente.";
            return;
        }
        window.location.href = "Login.html";
        return;
    }

    const carrinho = await resposta.json();
    const itens = carrinho.itens || [];

    if (itens.length === 0) {
        container.innerHTML = "";
        resumo.innerHTML = "";
        mensagem.textContent = "Seu carrinho está vazio.";
        return;
    }
    mensagem.textContent = "";

    container.innerHTML = itens.map(item => `
        <div class="cart-item" data-id="${item.idItemPedido}" data-subtotal="${item.subtotal}">
            <input type="checkbox" class="cart-selecao" title="Marcar para comprar" checked>
            <img class="cart-item-img" src="../images/${item.produto.imagem}" alt="${item.produto.nome}">
            <div class="cart-item-info">
                <h3>${item.produto.nome}</h3>
                <p>Tamanho: ${item.tamanho}</p>
                <p>Preço: ${formatarPreco(item.precoUnidade)}</p>
            </div>
            <input type="number" class="cart-qtd" value="${item.quantidade}" min="1">
            <p class="cart-subtotal">${formatarPreco(item.subtotal)}</p>
            <button class="cart-remover">Remover</button>
        </div>
    `).join("");

    resumo.innerHTML = `
        <div class="cart-resumo">
            <p>Total selecionado: <strong id="totalSelecionado">${formatarPreco(carrinho.valorTotal)}</strong></p>
            <button id="btnFinalizar" class="btn-auth btn-black">Finalizar Compra</button>
        </div>
    `;

    // total dos itens marcados com a bolinha
    function atualizarTotalSelecionado() {
        const total = Array.from(document.querySelectorAll(".cart-selecao:checked"))
            .reduce((soma, chk) => soma + Number(chk.closest(".cart-item").dataset.subtotal), 0);
        const el = document.getElementById("totalSelecionado");
        if (el) el.textContent = formatarPreco(total);
    }

    // mudar quantidade
    document.querySelectorAll(".cart-qtd").forEach(input => {
        input.addEventListener("change", async () => {
            const idItem = input.closest(".cart-item").dataset.id;
            const quantidade = parseInt(input.value, 10);
            if (!quantidade || quantidade < 1) {
                carregarCarrinho();
                return;
            }
            const resposta = await fetch(API + "/api/carrinho/itens/" + idItem + "/quantidade", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantidade })
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                alert(dados.erro || "Erro ao atualizar quantidade");
            }
            carregarCarrinho();
        });
    });

    // remover item
    document.querySelectorAll(".cart-remover").forEach(botao => {
        botao.addEventListener("click", async () => {
            const idItem = botao.closest(".cart-item").dataset.id;
            await fetch(API + "/api/carrinho/itens/" + idItem, {
                method: "DELETE",
                credentials: "include"
            });
            carregarCarrinho();
        });
    });

    // marcar/desmarcar produtos para a compra
    document.querySelectorAll(".cart-selecao").forEach(chk => {
        chk.addEventListener("change", atualizarTotalSelecionado);
    });

    // finalizar compra: leva para o checkout so com os produtos marcados
    document.getElementById("btnFinalizar").addEventListener("click", () => {
        const selecionados = Array.from(document.querySelectorAll(".cart-selecao:checked"))
            .map(chk => chk.closest(".cart-item").dataset.id);
        if (selecionados.length === 0) {
            alert("Marque ao menos um produto para comprar.");
            return;
        }
        window.location.href = "Checkout.html?itens=" + selecionados.join(",");
    });
}

carregarCarrinho();