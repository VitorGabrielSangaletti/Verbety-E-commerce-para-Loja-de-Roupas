const API = "";

// pega os filtros da URL
const parametros = new URLSearchParams(window.location.search);
const categoriaDaUrl = parametros.get("categoria");
const generoDaUrl = (parametros.get("genero") || "").toLowerCase();

let todosProdutos = [];
let generoAtual = generoDaUrl;
let textoBusca = parametros.get("busca") || "";

// deixa o texto minusculo e sem acento, para a busca funcionar melhor
function normalizar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

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
            <div class="card-imagem">
                <img src="../images/${produto.imagem}" class="imagem-1" alt="${produto.nome}" onerror="this.src='../images/guest.png'">
                <img src="../images/${produto.imagem2 || produto.imagem}" class="imagem-2" alt="${produto.nome}" onerror="this.src='../images/guest.png'">
                <button type="button" class="btn-sacola" data-add-carrinho="${produto.idProduto}" aria-label="Adicionar ${produto.nome} ao carrinho">
                    <i class="bi bi-bag"></i>
                </button>
            </div>
            <h3>${produto.nome}</h3>
            <p class="preco">R$ ${preco}</p>
        `;
    card.addEventListener("click", () => {
      window.location.href = "Produto.html?id=" + produto.idProduto;
    });
    grid.appendChild(card);
  });
}

// aplica genero + busca em cima da lista completa
function aplicarFiltros() {
  let lista = [...todosProdutos];

  if (generoAtual) {
    lista = lista.filter(
      (produto) => normalizar(produto.genero) === normalizar(generoAtual)
    );
  }

  if (textoBusca.trim() !== "") {
    const alvo = normalizar(textoBusca);
    lista = lista.filter((produto) => normalizar(produto.nome).includes(alvo));
  }

  renderizar(lista);
}

// usado pela lupa do header
window.filtrarPorBusca = function (texto) {
  textoBusca = texto;
  aplicarFiltros();
};

const TITULOS_GENERO = {
  masculino: "MASCULINO",
  feminino: "FEMININO",
  acessorio: "ACESSÃ“RIOS",
};

let tituloCategoria = "";

// titulo do topo acompanha o filtro atual
function atualizarTitulo() {
  const titulo = document.querySelector(".hero h1");
  if (!titulo) return;
  titulo.textContent = tituloCategoria
    ? tituloCategoria.toUpperCase()
    : TITULOS_GENERO[normalizar(generoAtual)] || "CATÃLOGO";
}

function marcarBotaoAtivo() {
  const acessorio = normalizar(generoAtual) === "acessorio";

  document.querySelectorAll(".btn-filtro").forEach((botao) => {
    const genero = normalizar(botao.dataset.genero);
    // acessorio nao tem genero: esconde masculino/feminino nessa visao
    const esconder =
      acessorio && (genero === "masculino" || genero === "feminino");

    botao.style.display = esconder ? "none" : "";
    botao.classList.toggle("ativo", genero === normalizar(generoAtual));
  });
}

function atualizarUrl() {
  const params = new URLSearchParams(window.location.search);
  if (generoAtual) {
    params.set("genero", generoAtual);
  } else {
    params.delete("genero");
  }
  const query = params.toString();
  history.replaceState(null, "", window.location.pathname + (query ? "?" + query : ""));
}

document.querySelectorAll(".btn-filtro").forEach((botao) => {
  botao.addEventListener("click", () => {
    generoAtual = botao.dataset.genero;
    marcarBotaoAtivo();
    atualizarTitulo();
    atualizarUrl();
    aplicarFiltros();
  });
});

async function iniciar() {
  let url = API + "/api/produtos";

  if (categoriaDaUrl) {
    url = API + "/api/produtos/categoria/" + categoriaDaUrl;

    const categorias = await carregarCategorias();
    const escolhida = categorias.find(
      (cat) => String(cat.idCategoria) === String(categoriaDaUrl)
    );
    if (escolhida) {
      tituloCategoria = escolhida.nome;
    }
  }

  const resposta = await fetch(url, { credentials: "include" });
  todosProdutos = await resposta.json();

  atualizarTitulo();
  marcarBotaoAtivo();
  aplicarFiltros();
}

iniciar();
