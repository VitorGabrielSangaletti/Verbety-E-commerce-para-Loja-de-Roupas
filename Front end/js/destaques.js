// Tela de Destaques (Verbety).
// Mostra dois blocos:
//  - Podio dos mais vendidos (#1, #2, #3): vem de GET /api/produtos/mais-vendidos,
//    que soma as quantidades vendidas (ignorando o carrinho aberto).
//  - Vitrine "Selecionados para voce": os produtos marcados como destaque pelo
//    admin (GET /api/produtos/destaques), com filtro por categoria e ordenacao.

const API = "http://localhost:8080";

let produtosDestaques = [];
let vendasPorProduto = {}; // idProduto -> total vendido
let categoriaAtual = "";
let ordenacaoAtual = "relevancia";

function formatarPreco(valor) {
  return "R$ " + Number(valor).toFixed(2).replace(".", ",");
}

function imagem(arquivo) {
  return "../images/" + arquivo;
}

// esgotado = todos os tamanhos com estoque 0
function estaEsgotado(produto) {
  if (!produto.tamanhos || produto.tamanhos.length === 0) return false;
  return produto.tamanhos.every((t) => t.quantidade === 0);
}

async function carregar() {
  const mensagem = document.getElementById("mensagem");
  try {
    const [rCategorias, rDestaques, rMaisVendidos] = await Promise.all([
      fetch(API + "/api/categorias", { credentials: "include" }),
      fetch(API + "/api/produtos/destaques", { credentials: "include" }),
      fetch(API + "/api/produtos/mais-vendidos?limite=100", { credentials: "include" }),
    ]);

    const categorias = rCategorias.ok ? await rCategorias.json() : [];
    produtosDestaques = rDestaques.ok ? await rDestaques.json() : [];
    const maisVendidos = rMaisVendidos.ok ? await rMaisVendidos.json() : [];

    maisVendidos.forEach((item) => {
      vendasPorProduto[item.produto.idProduto] = item.totalVendido;
    });

    montarFiltroCategorias(categorias);
    renderizarPodio(maisVendidos.slice(0, 3));
    renderizarGrid();
  } catch (erro) {
    mensagem.textContent = "Erro de conexão com o servidor.";
  }
}

function montarFiltroCategorias(categorias) {
  const select = document.getElementById("filtroCategoria");
  (categorias || []).forEach((cat) => {
    const opcao = document.createElement("option");
    opcao.value = cat.idCategoria;
    opcao.textContent = cat.nome;
    select.appendChild(opcao);
  });
}

function renderizarPodio(lista) {
  const podio = document.getElementById("podio");
  const secao = document.getElementById("podioSecao");

  if (!lista || lista.length === 0) {
    secao.style.display = "none";
    return;
  }

  podio.innerHTML = lista
    .map((item, i) => {
      const p = item.produto;
      const posicao = i + 1;
      const vendidos = item.totalVendido;
      return `
        <article class="podio-item ${posicao === 1 ? "primeiro" : ""}" data-id="${p.idProduto}">
            <span class="podio-posicao">${posicao}º</span>
            <img src="${imagem(p.imagem)}" alt="${p.nome}" onerror="this.src='${imagem("guest.png")}'">
            <h4>${p.nome}</h4>
            <p class="podio-vendas">${vendidos} venda${vendidos > 1 ? "s" : ""}</p>
            <strong>${formatarPreco(p.preco)}</strong>
        </article>`;
    })
    .join("");

  podio.querySelectorAll(".podio-item").forEach((el) => {
    el.addEventListener("click", () => {
      window.location.href = "Produto.html?id=" + el.dataset.id;
    });
  });
}

function renderizarGrid() {
  const grid = document.getElementById("gridDestaques");
  const mensagem = document.getElementById("mensagem");

  let lista = [...produtosDestaques];

  // filtro por categoria
  if (categoriaAtual) {
    lista = lista.filter(
      (p) => p.categoria && String(p.categoria.idCategoria) === String(categoriaAtual)
    );
  }

  // ordenacao
  switch (ordenacaoAtual) {
    case "preco-asc":
      lista.sort((a, b) => a.preco - b.preco);
      break;
    case "preco-desc":
      lista.sort((a, b) => b.preco - a.preco);
      break;
    case "mais-vendidos":
      lista.sort(
        (a, b) =>
          (vendasPorProduto[b.idProduto] || 0) - (vendasPorProduto[a.idProduto] || 0)
      );
      break;
    case "novidades":
      lista.sort((a, b) => b.idProduto - a.idProduto);
      break;
    default:
      break; // relevancia: mantem a ordem que veio da API
  }

  grid.innerHTML = "";

  if (lista.length === 0) {
    mensagem.textContent = "Nenhum destaque encontrado para esse filtro.";
    return;
  }
  mensagem.textContent = "";

  lista.forEach((produto) => {
    const card = document.createElement("div");
    card.className = "card-produto";
    card.innerHTML = `
        ${estaEsgotado(produto) ? '<span class="badge-esgotado">Esgotado</span>' : ""}
        <img src="${imagem(produto.imagem)}" alt="${produto.nome}" onerror="this.src='${imagem("guest.png")}'">
        <h3>${produto.nome}</h3>
        <p class="preco">${formatarPreco(produto.preco)}</p>`;
    card.addEventListener("click", () => {
      window.location.href = "Produto.html?id=" + produto.idProduto;
    });
    grid.appendChild(card);
  });
}

document.getElementById("filtroCategoria").addEventListener("change", (e) => {
  categoriaAtual = e.target.value;
  renderizarGrid();
});

document.getElementById("ordenar").addEventListener("change", (e) => {
  ordenacaoAtual = e.target.value;
  renderizarGrid();
});

carregar();
