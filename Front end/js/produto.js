const API = "http://localhost:8080";

let tamanhoSelecionado = null;

// pega o id da URL 
const parametros = new URLSearchParams(window.location.search);
const idProduto = parametros.get("id");

// verifica se o usuario esta logado (usuario comum, nao admin)
async function usuarioLogado() {
    const resposta = await fetch(API + "/api/auth/me", { credentials: "include" });
    if (!resposta.ok) return false;
    const dados = await resposta.json();
    return dados.tipo === "USUARIO";
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

                <button id="btnCarrinho" class="btn-login" ${esgotado ? "disabled" : ""}>
                    ${esgotado ? "Esgotado" : "Adicionar ao Carrinho"}
                </button>
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

        document.getElementById("btnCarrinho").addEventListener("click", async () => {
            if (!tamanhoSelecionado) {
                alert("Escolha um tamanho");
                return;
            }

            // visitante nao pode comprar: manda pro login
            if (!(await usuarioLogado())) {
                window.location.href = "Login.html";
                return;
            }

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

            const dados = await resposta.json();

            if (resposta.status === 401) {
                window.location.href = "Login.html";
                return;
            }

            if (!resposta.ok) {
                alert(dados.erro || "Não foi possível adicionar. Verifique o estoque.");
                return;
            }

            alert("Adicionado ao carrinho!");
        });

    } catch (erro) {
        mensagem.textContent = "Erro de conexão com o servidor";
    }
}

carregarProduto();