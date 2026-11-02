// Adiciona ao carrinho direto dos cards de produto (Home, CatÃ¡logo e Destaques)
(() => {
  const API = "";
  const cache = {};

  function mostrarToast(texto) {
    let toast = document.querySelector(".toast-carrinho");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast-carrinho";
      document.body.appendChild(toast);
    }
    toast.textContent = texto;
    void toast.offsetWidth; // reinicia a transicao
    toast.classList.add("visivel");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("visivel"), 2600);
  }

  async function buscarProduto(id) {
    if (cache[id]) return cache[id];
    const resposta = await fetch(API + "/api/produtos/" + id, { credentials: "include" });
    if (!resposta.ok) return null;
    cache[id] = await resposta.json();
    return cache[id];
  }

  async function situacaoLogin() {
    const resposta = await fetch(API + "/api/auth/me", { credentials: "include" });
    if (!resposta.ok) return { logado: false, tipo: null };
    const dados = await resposta.json();
    if (!dados.tipo) return { logado: false, tipo: null };
    return { logado: true, tipo: dados.tipo };
  }

  async function adicionar(produto) {
    // usa o primeiro tamanho com estoque (acessorio usa UNICO)
    const tamanho = (produto.tamanhos || []).find((t) => t.quantidade > 0);
    if (!tamanho) {
      mostrarToast("Produto esgotado.");
      return;
    }

    const situacao = await situacaoLogin();
    if (!situacao.logado) {
      window.location.href = "Login.html";
      return;
    }
    if (situacao.tipo !== "USUARIO") {
      alert("Apenas clientes podem comprar. Saia e entre como cliente para adicionar ao carrinho.");
      return;
    }

    try {
      const resposta = await fetch(API + "/api/carrinho/itens", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProduto: produto.idProduto,
          tamanho: tamanho.tamanho,
          quantidade: 1,
        }),
      });

      if (resposta.status === 401) {
        window.location.href = "Login.html";
        return;
      }

      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        mostrarToast(dados.erro || "NÃ£o foi possÃ­vel adicionar ao carrinho.");
        return;
      }

      mostrarToast(produto.nome + " adicionado ao carrinho!");
    } catch (erro) {
      mostrarToast("Erro de conexÃ£o com o servidor.");
    }
  }

  // captura antes do clique do card (que abre a pagina do produto)
  document.addEventListener(
    "click",
    async (evento) => {
      const botao = evento.target.closest("[data-add-carrinho]");
      if (!botao) return;

      evento.preventDefault();
      evento.stopPropagation();

      if (botao.dataset.carregando === "true") return;
      botao.dataset.carregando = "true";
      botao.classList.add("carregando");

      try {
        const produto = await buscarProduto(botao.dataset.addCarrinho);
        if (!produto) {
          mostrarToast("Produto nÃ£o encontrado.");
          return;
        }
        await adicionar(produto);
      } finally {
        botao.dataset.carregando = "false";
        botao.classList.remove("carregando");
      }
    },
    true
  );
})();
