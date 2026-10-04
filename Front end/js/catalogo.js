const API = "http://localhost:8080";

// pega a categoria da URL
const parametros = new URLSearchParams(window.location.search);
const categoriaDaUrl = parametros.get("categoria");

// busca as categorias; o filtro em si fica no dropdown do header,
// aqui so usamos para descobrir o nome da categoria vinda da URL
async function carregarCategorias() {
  const resposta = await fetch(API + "/api/categorias", {
    credentials: "include",
  });
  return resposta.json();
}

// esgotado = todos os tamanhos com estoque 0
function estaEsgotado(produto) {
  if (!produto.tamanhos || produto.tamanhos.length === 0) return false;
  return produto.tamanhos.every((t) => t.quantidade === 0);
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

  produtos.forEach((produto) => {
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
  const resposta = await fetch(API + "/api/produtos", {
    credentials: "include",
  });
  renderizar(await resposta.json());
}

// busca por nome enquanto digita
document.getElementById("busca").addEventListener("input", async (event) => {
  const texto = event.target.value.trim();
  const url =
    texto === ""
      ? API + "/api/produtos"
      : API + "/api/produtos/buscar?nome=" + encodeURIComponent(texto);
  const resposta = await fetch(url, { credentials: "include" });
  renderizar(await resposta.json());
});

async function iniciar() {
  const categorias = await carregarCategorias();

  if (categoriaDaUrl) {
    // titulo da pagina = nome da categoria, sem depender do select
    const escolhida = categorias.find(
      (cat) => String(cat.idCategoria) === String(categoriaDaUrl)
    );
    if (escolhida) {
      document.querySelector(".titulo-pagina").textContent = escolhida.nome;
    }

    const resposta = await fetch(
      API + "/api/produtos/categoria/" + categoriaDaUrl,
      { credentials: "include" }
    );
    renderizar(await resposta.json());
  } else {
    carregarProdutos();
  }
}

iniciar();
