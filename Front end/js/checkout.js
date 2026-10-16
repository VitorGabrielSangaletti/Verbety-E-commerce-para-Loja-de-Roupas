// Checkout: revisa os itens, escolhe pagamento e confirma o pedido

const API = "http://localhost:8080";

function formatarPreco(valor) {
    return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

// carrega o carrinho (pedido ABERTO) do usuario logado
async function carregarCheckout() {
    const conteudo = document.getElementById("conteudoCheckout");

    const resposta = await fetch(API + "/api/carrinho", { credentials: "include" });

    // sem login nao tem carrinho: vai pro login; admin nao compra (avisa)
    if (resposta.status === 401) {
        const me = await fetch(API + "/api/auth/me", { credentials: "include" })
            .then(r => r.json()).catch(() => ({}));
        if (me.tipo === "ADMIN") {
            conteudo.innerHTML = `
                <div class="checkout-vazio">
                    <p>Apenas clientes podem finalizar compras.</p>
                    <p><a href="Home.html">Voltar para a Home</a></p>
                </div>`;
            return;
        }
        window.location.href = "Login.html";
        return;
    }

    const carrinho = await resposta.json();

    // filtros vindos na URL:
    //  - itens=3,5  -> so os itens marcados no carrinho
    //  - produto=X&tamanho=PP -> compra direto de um produto
    const parametros = new URLSearchParams(window.location.search);
    const idsSelecionados = (parametros.get("itens") || "").split(",").map(Number).filter(n => n > 0);
    const produtoDireto = parametros.get("produto");
    const tamanhoDireto = parametros.get("tamanho");

    let itens = carrinho.itens || [];
    if (idsSelecionados.length > 0) {
        itens = itens.filter(item => idsSelecionados.includes(Number(item.idItemPedido)));
    } else if (produtoDireto) {
        itens = itens.filter(item =>
            Number(item.produto.idProduto) === Number(produtoDireto) &&
            (!tamanhoDireto || item.tamanho === tamanhoDireto)
        );
    }

    // total sempre dos itens que estao aparecendo no checkout
    const valorTotal = itens.reduce((soma, item) => soma + Number(item.subtotal), 0);

    if (itens.length === 0) {
        conteudo.innerHTML = `
            <div class="checkout-vazio">
                <p>Nenhum produto selecionado para a compra.</p>
                <p><a href="Carrinho.html">Voltar para o carrinho</a> · <a href="Catalogo.html">Ver catálogo</a></p>
            </div>`;
        return;
    }

    const itensHtml = itens.map(item => `
        <div class="cart-item" data-id="${item.idItemPedido}">
            <img class="cart-item-img" src="../images/${item.produto.imagem}" alt="${item.produto.nome}" onerror="this.src='../images/guest.png'">
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

    conteudo.innerHTML = `
        <div class="checkout-itens">${itensHtml}</div>

        <div class="checkout-resumo">
            <h3>Resumo do pedido</h3>

            <label for="formaPagamento">Forma de pagamento</label>
            <select id="formaPagamento">
                <option value="PIX">Pix</option>
                <option value="CARTAO_CREDITO">Cartão de crédito</option>
                <option value="CARTAO_DEBITO">Cartão de débito</option>
                <option value="BOLETO">Boleto</option>
            </select>

            <label for="observacao">Observação (opcional)</label>
            <textarea id="observacao" rows="2" placeholder="Ex: vestido tamanho M, retirada na loja..."></textarea>

            <div class="checkout-total">
                <p>Total</p>
                <strong>${formatarPreco(valorTotal)}</strong>
            </div>

            <button id="btnConfirmar" class="btn-confirmar">Confirmar pedido</button>
        </div>
    `;

    // mudar a quantidade direto no checkout
    document.querySelectorAll(".cart-qtd").forEach(input => {
        input.addEventListener("change", async () => {
            const idItem = input.closest(".cart-item").dataset.id;
            const quantidade = parseInt(input.value, 10);
            if (!quantidade || quantidade < 1) {
                carregarCheckout();
                return;
            }
            const resp = await fetch(API + "/api/carrinho/itens/" + idItem + "/quantidade", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantidade })
            });
            const dados = await resp.json();
            if (!resp.ok) alert(dados.erro || "Erro ao atualizar quantidade");
            carregarCheckout();
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
            carregarCheckout();
        });
    });

    // confirmar a compra
    document.getElementById("btnConfirmar").addEventListener("click", confirmarPedido);
}

async function confirmarPedido() {
    const botao = document.getElementById("btnConfirmar");

    const formaPagamento = document.getElementById("formaPagamento").value;
    const observacao = document.getElementById("observacao").value.trim() || null;
    // so os itens que estao aparecendo no checkout entram na compra
    const itens = Array.from(document.querySelectorAll(".cart-item")).map(el => Number(el.dataset.id));

    botao.disabled = true;
    botao.textContent = "Confirmando...";

    const resposta = await fetch(API + "/api/carrinho/finalizar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formaPagamento, observacao, itens })
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro || "Não foi possível finalizar o pedido");
        botao.disabled = false;
        botao.textContent = "Confirmar pedido";
        carregarCheckout(); // atualiza estoque/estado
        return;
    }

    mostrarSucesso(dados, formaPagamento);
}

// tela de pedido confirmado, com o resumo do que foi comprado
function mostrarSucesso(pedido, formaPagamento) {
    const conteudo = document.getElementById("conteudoCheckout");
    const itens = pedido.itens || [];

    const itensHtml = itens.map(item => `
        <div class="cart-item">
            <img class="cart-item-img" src="../images/${item.produto.imagem}" alt="${item.produto.nome}" onerror="this.src='../images/guest.png'">
            <div class="cart-item-info">
                <h3>${item.produto.nome}</h3>
                <p>Tamanho: ${item.tamanho} &middot; Quantidade: ${item.quantidade}</p>
            </div>
            <p class="cart-subtotal">${formatarPreco(item.subtotal)}</p>
        </div>
    `).join("");

    conteudo.innerHTML = `
        <div class="checkout-sucesso">
            <i class="bi bi-check-circle"></i>
            <h2>Pedido confirmado!</h2>
            <p>Obrigado pela compra. Pedido nº ${pedido.idPedido} · status ${pedido.status}.</p>

            <div class="sucesso-itens">${itensHtml}</div>

            <p class="sucesso-total">Total: <strong>${formatarPreco(pedido.valorTotal)}</strong></p>
            <p>Pagamento: ${pedido.formaPagamento || formaPagamento || "—"}</p>

            <div class="sucesso-acoes">
                <a href="Home.html" class="btn-secundario">Voltar pra Home</a>
                <a href="Catalogo.html" class="btn-confirmar botao-livre">Continuar comprando</a>
            </div>
        </div>
    `;
}

carregarCheckout();