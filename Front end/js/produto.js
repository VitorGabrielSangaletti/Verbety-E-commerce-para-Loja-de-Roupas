const API = "http://localhost:8080";

let tamanhoSelecionado = null;

// pega o id da URL 
const parametros = new URLSearchParams(window.location.search);
const idProduto = parametros.get("id");

// descobre se tem alguem logado e qual o tipo (USUARIO ou ADMIN)
async function situacaoLogin() {
    const resposta = await fetch(API + "/api/auth/me", { credentials: "include" });
    if (!resposta.ok) return { logado: false, tipo: null };
    const dados = await resposta.json();
    if (!dados.tipo) return { logado: false, tipo: null };
    return { logado: true, tipo: dados.tipo };
}

// admin/funcionario nao compra: avisa em vez de jogar pro login
function avisarApenasCliente() {
    alert("Apenas clientes podem comprar. Saia e entre como cliente para adicionar ao carrinho.");
}

// adiciona 1 unidade do produto/tamanho no carrinho.
// retorna os dados do carrinho atualizado ou null se deu errado.
async function adicionarProduto(produto) {
    const resposta = await fetch(API + "/api/carrinho/itens", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idProduto: produto.idProduto,
            tamanho: tamanhoSelecionado,
            quantidade: 1
        })
    });

    if (resposta.status === 401) {
        window.location.href = "Login.html";
        return null;
    }

    const dados = await resposta.json();

    if (!resposta.ok) {
        alert(dados.erro || "Não foi possível adicionar. Verifique o estoque.");
        return null;
    }

    return dados;
}

async function carregarProduto() {
    const mensagem = document.getElementById("mensagem");
    const conteudo = document.getElementById("conteudoProduto");

    try {
        const resposta = await fetch(API + "/api/produtos/" + idProduto, { credentials: "include" });

        // produto nao existe
        if (resposta.status === 404) {
            mensagem.textContent = "Produto não encontrado.";
            return;
        }

        const produto = await resposta.json();
        const preco = Number(produto.preco).toFixed(2).replace(".", ",");
        const esgotado = !produto.tamanhos || produto.tamanhos.length === 0 ||
            produto.tamanhos.every(t => t.quantidade === 0);

        // monta os botoes de tamanho e desabilita os com estoque 0
        let botoesTamanho = "";
        if (produto.tamanhos && produto.tamanhos.length > 0) {
            botoesTamanho = produto.tamanhos.map(t => {
                const semEstoque = t.quantidade === 0;
                return `<button type="button"
                    class="btn-tamanho ${semEstoque ? "desabilitado" : ""}"
                    data-tamanho="${t.tamanho}" ${semEstoque ? "disabled" : ""}>
                    ${t.tamanho}${semEstoque ? " (esgotado)" : ""}
                </button>`;
            }).join("");
        }

        conteudo.innerHTML = `
            <img class="imagem-produto" src="../images/${produto.imagem}" alt="${produto.nome}" onerror="this.src='../images/guest.png'">
            <div class="info-produto">
                <h2>${produto.nome}</h2>
                <p class="preco">R$ ${preco}</p>
                <p>${produto.descricao || "Sem descrição."}</p>

                <h4>Tamanhos:</h4>
                <div class="tamanhos">${botoesTamanho || "<span>Nenhum tamanho cadastrado.</span>"}</div>

                <div class="acoes-produto">
                    <button id="btnCarrinho" class="btn-adicionar" ${esgotado ? "disabled" : ""}>
                        ${esgotado ? "Esgotado" : "Adicionar ao Carrinho"}
                    </button>
                    <button id="btnComprar" class="btn-comprar" ${esgotado ? "disabled" : ""}>
                        Comprar agora
                    </button>
                </div>
            </div>
        `;

        // marca o tamanho escolhido
        document.querySelectorAll(".btn-tamanho:not(.desabilitado)").forEach(botao => {
            botao.addEventListener("click", () => {
                document.querySelectorAll(".btn-tamanho").forEach(b => b.classList.remove("selecionado"));
                botao.classList.add("selecionado");
                tamanhoSelecionado = botao.dataset.tamanho;
            });
        });

        // "Adicionar ao Carrinho": adiciona e continua na pagina
        document.getElementById("btnCarrinho").addEventListener("click", async () => {
            if (!tamanhoSelecionado) {
                alert("Escolha um tamanho");
                return;
            }

            // visitante nao pode comprar: manda pro login
            const situacao = await situacaoLogin();
            if (!situacao.logado) {
                window.location.href = "Login.html";
                return;
            }
            // admin nao compra: avisa e nao redireciona
            if (situacao.tipo !== "USUARIO") {
                avisarApenasCliente();
                return;
            }

            const resultado = await adicionarProduto(produto);
            if (resultado) alert("Adicionado ao carrinho!");
        });

        // "Comprar agora": adiciona e abre o checkout direto,
        // mostrando so esse produto (e as opcoes de compra)
        document.getElementById("btnComprar").addEventListener("click", async () => {
            if (!tamanhoSelecionado) {
                alert("Escolha um tamanho");
                return;
            }

            const situacao = await situacaoLogin();
            if (!situacao.logado) {
                window.location.href = "Login.html";
                return;
            }
            if (situacao.tipo !== "USUARIO") {
                avisarApenasCliente();
                return;
            }

            const resultado = await adicionarProduto(produto);
            if (resultado) {
                window.location.href = "Checkout.html?produto=" + produto.idProduto +
                    "&tamanho=" + encodeURIComponent(tamanhoSelecionado);
            }
        });

    } catch (erro) {
        mensagem.textContent = "Erro de conexão com o servidor";
    }
}

carregarProduto();