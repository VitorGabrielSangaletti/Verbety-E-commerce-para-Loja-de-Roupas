const API = "";

function formatarPreco(valor) {
    return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

const FUSO_LOJA = "America/Sao_Paulo";
const ABERTURA_MINUTOS = 8 * 60;          // 08:00
const FECHAMENTO_MINUTOS = 17 * 60 + 30;  // 17:30

// data de hoje no horario de Brasilia, no formato aceito pelo input date
function dataHojeLoja() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: FUSO_LOJA,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function lojaAbertaAgora() {
    const partes = new Intl.DateTimeFormat("en-US", {
        timeZone: FUSO_LOJA,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).formatToParts(new Date());

    const valor = (tipo) => Number((partes.find(p => p.type === tipo) || {}).value || 0);
    const minutos = valor("hour") * 60 + valor("minute");
    return minutos >= ABERTURA_MINUTOS && minutos < FECHAMENTO_MINUTOS;
}

function atualizarStatusLoja() {
    const status = document.getElementById("lojaStatus");
    const texto = document.getElementById("lojaStatusTexto");
    if (!status || !texto) return;

    const aberta = lojaAbertaAgora();
    status.classList.toggle("aberta", aberta);
    status.classList.toggle("fechada", !aberta);
    texto.textContent = aberta ? "Loja aberta agora" : "Loja fechada agora";
}

let intervaloLoja = null;

function iniciarStatusLoja() {
    atualizarStatusLoja();
    clearInterval(intervaloLoja);
    intervaloLoja = setInterval(atualizarStatusLoja, 60000);
}

function formatarData(dataIso) {
    if (!dataIso) return "—";
    const [ano, mes, dia] = String(dataIso).slice(0, 10).split("-");
    if (!ano || !mes || !dia) return dataIso;
    return `${dia}/${mes}/${ano}`;
}

// carrega o carrinho do usuario logado
async function carregarCheckout() {
    const conteudo = document.getElementById("conteudoCheckout");

    const resposta = await fetch(API + "/api/carrinho", { credentials: "include" });

    // se tiver sem login vai pro login e se for admin nao compra 
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

    // total dos itens que estao aparecendo no checkout
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

    const dataMinima = dataHojeLoja();

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

            <div class="checkout-extra">
                <div class="checkout-observacao">
                    <label for="observacao">Observação (opcional)</label>
                    <textarea id="observacao" rows="4" placeholder="Ex: embalagem para presente..."></textarea>
                </div>

                <aside class="checkout-retirada">
                    <div class="loja-status" id="lojaStatus">
                        <span class="loja-status__ponto" aria-hidden="true"></span>
                        <span id="lojaStatusTexto">Verificando horário...</span>
                    </div>

                    <p class="loja-horario">Funcionamento: <strong>08:00 às 17:30</strong></p>

                    <label for="dataRetirada">Data de retirada <span class="obrigatorio">*</span></label>
                    <input type="date" id="dataRetirada" min="${dataMinima}" required>
                    <small class="loja-dica">Escolha o dia em que vai retirar o pedido na loja.</small>
                </aside>
            </div>

            <div class="checkout-total">
                <p>Total</p>
                <strong>${formatarPreco(valorTotal)}</strong>
            </div>

            <button id="btnConfirmar" class="btn-confirmar">Confirmar pedido</button>
        </div>
    `;

    iniciarStatusLoja();

    // muda a quantidade direto no checkout
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
            if (!resp.ok) UI.alerta(dados.erro || "Erro ao atualizar quantidade", { tipo: "erro" });
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

    const campoData = document.getElementById("dataRetirada");
    const dataRetirada = campoData.value;
    const hoje = dataHojeLoja();

    if (!dataRetirada) {
        UI.alerta("Informe a data de retirada do pedido.", { tipo: "aviso" });
        campoData.focus();
        return;
    }

    if (dataRetirada < hoje) {
        UI.alerta("A data de retirada não pode ser no passado.", { tipo: "aviso" });
        campoData.focus();
        return;
    }

    // validacao para que so os itens que estao aparecendo no checkout entram na compra
    const itens = Array.from(document.querySelectorAll(".cart-item")).map(el => Number(el.dataset.id));

    botao.disabled = true;
    botao.textContent = "Confirmando...";

    const resposta = await fetch(API + "/api/carrinho/finalizar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formaPagamento, observacao, dataRetirada, itens })
    });
    const dados = await resposta.json();

    if (!resposta.ok) {
        UI.alerta(dados.erro || "Não foi possível finalizar o pedido", { tipo: "erro" });
        botao.disabled = false;
        botao.textContent = "Confirmar pedido";
        carregarCheckout(); // atualiza estoque
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
            <p>Retirada na loja: <strong>${formatarData(pedido.dataRetirada)}</strong></p>

            <div class="sucesso-acoes">
                <a href="Home.html" class="btn-secundario">Voltar pra Home</a>
                <a href="Catalogo.html" class="btn-confirmar botao-livre">Continuar comprando</a>
            </div>
        </div>
    `;
}

carregarCheckout();