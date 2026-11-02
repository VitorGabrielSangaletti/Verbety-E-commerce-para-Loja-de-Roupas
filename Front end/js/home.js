(() => {
  const API = "";

  window.homeDinamico = true;

  const imagem = (arquivo) => "../images/" + arquivo;

  async function carregar() {
    try {
      const [respostaConfig, respostaDestaques] = await Promise.all([
        fetch(API + "/api/home", { credentials: "include" }),
        fetch(API + "/api/produtos/destaques-home", { credentials: "include" })
      ]);

      if (respostaConfig.ok) {
        const config = await respostaConfig.json();
        aplicarBanner(config);
        aplicarCards(config);
        aplicarCarrossel(config);
      }

      if (respostaDestaques.ok) {
        aplicarDestaques(await respostaDestaques.json());
      }
    } catch (erro) {
      console.log("[home] API indisponivel, mantendo conteudo estatico:", erro.message);
    } finally {
      // com ou sem API, inicia o carrossel 
      if (typeof window.iniciarSlider === "function") {
        window.iniciarSlider();
      }
    }
  }

  function aplicarBanner(config) {
    const imgBanner = document.querySelector(".imagem-promocao img");
    if (imgBanner && config.bannerImagem) {
      imgBanner.src = imagem(config.bannerImagem);
      imgBanner.onerror = () => { imgBanner.src = "../images/guest.png"; };
    }

    const textoBanner = document.querySelector(".texto-promocao");
    if (textoBanner && typeof config.bannerTexto === "string") {
      textoBanner.textContent = config.bannerTexto;
    }
  }

  function aplicarCards(config) {
    const cards = document.querySelectorAll(".card-container .card");
    (config.cards || []).forEach((dados, i) => {
      const card = cards[i];
      if (!card || !dados) return;

      const img = card.querySelector("img");
      if (img && dados.imagem) {
        img.src = imagem(dados.imagem);
        img.onerror = () => { img.src = "../images/guest.png"; };
      }

      const titulo = card.querySelector("h3");
      if (titulo && typeof dados.titulo === "string") titulo.textContent = dados.titulo;

      const texto = card.querySelector("p");
      if (texto && typeof dados.texto === "string") texto.textContent = dados.texto;
    });
  }

  function aplicarCarrossel(config) {
    const track = document.querySelector(".track");
    if (!track || !Array.isArray(config.carrossel) || config.carrossel.length === 0) return;

    track.innerHTML = "";
    config.carrossel.forEach((arquivo) => {
      const slide = document.createElement("img");
      slide.className = "slide";
      slide.src = imagem(arquivo);
      slide.onerror = () => { slide.src = "../images/guest.png"; };
      track.appendChild(slide);
    });
  }

  function aplicarDestaques(produtos) {
    const lista = document.querySelector(".lista-produtos");
    if (!lista || !Array.isArray(produtos) || produtos.length === 0) return;

    lista.innerHTML = "";
    produtos.forEach((p) => {
      const preco = Number(p.preco).toFixed(2).replace(".", ",");

      const card = document.createElement("div");
      card.className = "produto";
      card.style.cursor = "pointer";
      card.innerHTML = `
        <div class="imagem-produto">
          <img src="${imagem(p.imagem)}" class="imagem-1" onerror="this.src='../images/guest.png'">
          <img src="${imagem(p.imagem2 || p.imagem)}" class="imagem-2" onerror="this.src='../images/guest.png'">
          <button type="button" class="btn-sacola" data-add-carrinho="${p.idProduto}" aria-label="Adicionar ${p.nome} ao carrinho">
            <i class="bi bi-bag"></i>
          </button>
        </div>
        <p class="nome">${p.nome}</p>
        <hr>
        <strong>R$ ${preco}</strong>
      `;
      card.addEventListener("click", (event) => {
        if (event.target.closest("[data-add-carrinho]")) return; // clicar na sacolinha nao navega
        window.location.href = "Produto.html?id=" + p.idProduto;
      });
      lista.appendChild(card);
    });
  }

  carregar();
})();
