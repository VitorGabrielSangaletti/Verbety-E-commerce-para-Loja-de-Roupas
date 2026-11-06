const API = "";

let tamanhoSelecionado = null;

// pega o id da URL 
const parametros = new URLSearchParams(window.location.search);
const idProduto = parametros.get("id");

// descobre se tem alguem logado e qual o tipo (usuario ou admin)
async function situacaoLogin() {
    const resposta = await fetch(API + "/api/auth/me", { credentials: "include" });
    if (!resposta.ok) return { logado: false, tipo: null };
    const dados = await resposta.json();
    if (!dados.tipo) return { logado: false, tipo: null };
    return { logado: true, tipo: dados.tipo };
}

// admin nao compra e envia um alerta
function avisarApenasCliente() {
    UI.alerta(
        "Apenas clientes podem comprar. Saia e entre como cliente para adicionar ao carrinho.",
        { tipo: "aviso" }
    );
}

//adiciona no carrinho, retorna o item adicionado ou retorna vazio se der erro
async function adicionarProduto(produto) {
    const qtd = Number(document.getElementById("inputQtd").value || 1);
    const resposta = await fetch(API + "/api/carrinho/itens", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idProduto: produto.idProduto,
            tamanho: tamanhoSelecionado,
            quantidade: qtd
        })
    });

    if (resposta.status === 401) {
        window.location.href = "Login.html";
        return null;
    }

    const dados = await resposta.json();

    if (!resposta.ok) {
        UI.alerta(dados.erro || "Não foi possível adicionar. Verifique o estoque.", { tipo: "erro" });
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

        const imagemFrente = produto.imagem;
        const imagemTras = produto.imagem2 || produto.imagem;

        conteudo.innerHTML = `
            <div class="produto-detalhes">
                <div class="produto-galeria">
                    <div class="produto-miniaturas">
                        <img class="miniatura ativa"
                             src="../images/${imagemFrente}" data-src="${imagemFrente}"
                             alt="Frente" onerror="this.src='../images/guest.png'">
                        ${imagemTras && imagemTras !== imagemFrente
                            ? `<img class="miniatura" src="../images/${imagemTras}" data-src="${imagemTras}"
                                   alt="Trás" onerror="this.src='../images/guest.png'">`
                            : ""
                        }
                    </div>
                    <div class="produto-imagem-principal">
                        <img id="imgPrincipal" src="../images/${imagemFrente}" alt="${produto.nome}"
                             onerror="this.src='../images/guest.png'">
                    </div>
                </div>

                <div class="produto-info">
                    <h1>${produto.nome}</h1>
                    <p class="preco">R$ ${preco}</p>

                    <div class="produto-selecoes">
                        <div class="selecao-tamanhos">
                            <h4>Tamanho</h4>
                            <div class="tamanhos">${botoesTamanho || "<span>Nenhum tamanho cadastrado.</span>"}</div>
                        </div>

                        <div class="selecao-quantidade">
                            <h4>Quantidade</h4>
                            <div class="quantidade-controle">
                                <button type="button" id="btnQtdMenos" class="btn-qtd">-</button>
                                <input type="number" id="inputQtd" value="1" min="1" readonly>
                                <button type="button" id="btnQtdMais" class="btn-qtd">+</button>
                            </div>
                        </div>
                    </div>

                    <div class="acoes-produto">
                        <button id="btnCarrinho" class="btn-adicionar" ${esgotado ? "disabled" : ""}>
                            ${esgotado ? "Esgotado" : "Adicionar ao Carrinho"}
                        </button>
                        <button id="btnComprar" class="btn-comprar" ${esgotado ? "disabled" : ""}>
                            Comprar agora
                        </button>
                    </div>

                    <div class="produto-descricao">
                        <h2>Descrição</h2>
                        <p>${produto.descricao || "Sem descrição."}</p>
                    </div>
                </div>
            </div>
        `;

        // troca a imagem principal ao clicar na miniatura
        document.querySelectorAll(".miniatura").forEach(miniatura => {
            miniatura.addEventListener("click", () => {
                document.querySelectorAll(".miniatura").forEach(m => m.classList.remove("ativa"));
                miniatura.classList.add("ativa");
                document.getElementById("imgPrincipal").src = "../images/" + miniatura.dataset.src;
            });
        });

        // controle de quantidade
        const inputQtd = document.getElementById("inputQtd");
        document.getElementById("btnQtdMenos").addEventListener("click", () => {
            const atual = Number(inputQtd.value || 1);
            if (atual > 1) inputQtd.value = atual - 1;
        });
        document.getElementById("btnQtdMais").addEventListener("click", () => {
            const atual = Number(inputQtd.value || 1);
            inputQtd.value = atual + 1;
        });

        // marca o tamanho escolhido
        document.querySelectorAll(".btn-tamanho:not(.desabilitado)").forEach(botao => {
            botao.addEventListener("click", () => {
                document.querySelectorAll(".btn-tamanho").forEach(b => b.classList.remove("selecionado"));
                botao.classList.add("selecionado");
                tamanhoSelecionado = botao.dataset.tamanho;
            });
        });

        // "Adicionar ao Carrinho" adiciona e continua na pagina
        document.getElementById("btnCarrinho").addEventListener("click", async () => {
            if (!tamanhoSelecionado) {
                UI.alerta("Escolha um tamanho", { tipo: "aviso" });
                return;
            }

            //impede os visitante de comprar e manda pro login
            const situacao = await situacaoLogin();
            if (!situacao.logado) {
                window.location.href = "Login.html";
                return;
            }
            // admin nao compra e avisa com um alerta
            if (situacao.tipo !== "USUARIO") {
                avisarApenasCliente();
                return;
            }

            const resultado = await adicionarProduto(produto);
            if (resultado) UI.toast("Adicionado ao carrinho!", "sucesso");
        });

        // "Comprar agora" adiciona e abre o checkout direto
        document.getElementById("btnComprar").addEventListener("click", async () => {
            if (!tamanhoSelecionado) {
                UI.alerta("Escolha um tamanho", { tipo: "aviso" });
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