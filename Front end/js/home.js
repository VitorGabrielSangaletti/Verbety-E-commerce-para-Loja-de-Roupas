// preenche a secao DESTAQUES com os produtos em destaque do banco

const API_HOME = "http://localhost:8080";

function formatarPreco(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

function renderizarDestaques(produtos) {
  const container = document.getElementById("listaDestaques");
  if (!container) return;

  container.innerHTML = "";

  if (!Array.isArray(produtos) || produtos.length === 0) {
    container.innerHTML = '<p class="mensagem">Nenhum destaque disponible.</p>';
    return;
  }

  produtos.forEach((produto) => {
    const card = document.createElement("div");
    card.className = "card3";

    card.innerHTML = `
      <img src="../images/${produto.imagem}" alt="${produto.nome}" onerror="this.src='../images/guest.png'">
      <div class="card3-info">
        <p class="card3-nome">${produto.nome}</p>
        <p class="card3-preco">R$ ${formatarPreco(produto.preco)}</p>
        <p class="card3-parcelas">ou 12x de R$ ${formatarPreco(produto.preco / 12)}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = "Produto.html?id=" + produto.idProduto;
    });

    container.appendChild(card);
  });
}

fetch(API_HOME + "/api/produtos/destaques")
  .then((resposta) => resposta.json())
  .then(renderizarDestaques)
  .catch((erro) => {
    console.log("[home] falha ao buscar destaques:", erro.message);
  });