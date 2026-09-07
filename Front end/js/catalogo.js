const API = "http://localhost:8080";

// pega a categoria da URL 
const parametros = new URLSearchParams(window.location.search);
const categoriaDaUrl = parametros.get("categoria");

// carrega as categorias no select de filtro
async function carregarCategorias() {
    const resposta = await fetch(API + "/api/categorias", { credentials: "include" });
    const categorias = await resposta.json();
    const select = document.getElementById("filtroCategoria");
    categorias.forEach(cat => {
        const opcao = document.createElement("option");
        opcao.value = cat.idCategoria;
        opcao.textContent = cat.nome;
        select.appendChild(opcao);
    });
}

// esgotado = todos os tamanhos com estoque 0
function estaEsgotado(produto) {
    if (!produto.tamanhos || produto.tamanhos.length === 0) return false;
    return produto.tamanhos.every(t => t.quantidade === 0);
}

// desenha os cards na tela
function renderizar(produtos) {
    const grid = document.getElementById("grid");
    const mensagem = document.getElementById("mensagem");
    grid.innerHTML = "";

    if (!Array.isArray(produtos) || produtos.length === 0) {
        mensagem.textContent = "Nenhum produto encontrado.";
        return;
    }
    mensagem.textContent = "";

    produtos.forEach(produto => {
        const card = document.createElement("div");
        card.className = "card-produto";

        const preco = Number(produto.preco).toFixed(2).replace(".", ",");

        card.innerHTML = `
            ${estaEsgotado(produto) ? '<span class="badge-esgotado">Esgotado</span>' : ""}
            <img src="../images/${produto.imagem}" alt="${produto.nome}" onerror="this.src='../images/guest.png'">
            <h3>${produto.nome}</h3>
            <p class="preco">R$ ${preco}</p>
        `;
        card.addEventListener("click", () => {
            window.location.href = "Produto.html?id=" + produto.idProduto;
        });
        grid.appendChild(card);
    });
}

// lista todos os produtos
async function carregarProdutos() {
    const resposta = await fetch(API + "/api/produtos", { credentials: "include" });
    renderizar(await resposta.json());
}

// busca por nome enquanto digita
document.getElementById("busca").addEventListener("input", async (event) => {
    const texto = event.target.value.trim();
    const url = texto === ""
        ? API + "/api/produtos"
        : API + "/api/produtos/buscar?nome=" + encodeURIComponent(texto);
    const resposta = await fetch(url, { credentials: "include" });
    renderizar(await resposta.json());
});

// filtro por categoria
document.getElementById("filtroCategoria").addEventListener("change", async (event) => {
    const id = event.target.value;
    const url = id === ""
        ? API + "/api/produtos"
        : API + "/api/produtos/categoria/" + id;
    const resposta = await fetch(url, { credentials: "include" });
    renderizar(await resposta.json());
});


async function iniciar() {
    await carregarCategorias();
    if (categoriaDaUrl) {
        document.getElementById("filtroCategoria").value = categoriaDaUrl;
        const resposta = await fetch(API + "/api/produtos/categoria/" + categoriaDaUrl, { credentials: "include" });
        renderizar(await resposta.json());
    } else {
        carregarProdutos();
    }
}

iniciar();