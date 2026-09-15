const API = "http://localhost:8080";

function formatarPreco(valor) {
    return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

async function carregarCarrinho() {
    const container = document.getElementById("itensCarrinho");
    const resumo = document.getElementById("resumo");
    const mensagem = document.getElementById("mensagem");

    const resposta = await fetch(API + "/api/carrinho", { credentials: "include" });

    // quando nao tiver logado vai pro login
    if (resposta.status === 401) {
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
        <div class="cart-item" data-id="${item.idItemPedido}">
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
            <p>Total: <strong>${formatarPreco(carrinho.valorTotal)}</strong></p>
            <button id="btnFinalizar" class="btn-auth btn-black">Finalizar Compra</button>
        </div>
    `;

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

    // finalizar compra
    document.getElementById("btnFinalizar").addEventListener("click", async () => {
        if (!confirm("Finalizar a compra?")) return;
        const resposta = await fetch(API + "/api/carrinho/finalizar", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formaPagamento: "PIX" })
        });
        const dados = await resposta.json();
        if (!resposta.ok) {
            alert(dados.erro || "Não foi possível finalizar");
            return;
        }
        alert("Pedido realizado com sucesso!");
        window.location.href = "Home.html";
    });
}

carregarCarrinho();