// Home dinamica (Verbety) - atualizado em 13/10.
//
// A Home.html continua com os textos/imagens fixos. Este arquivo, que ja era
// carregado pela Home, agora busca a configuracao salva pelo painel do admin
// (GET /api/home) e os produtos marcados como destaque (GET /api/produtos/destaques),
// e sobrescreve o conteudo fixo. Se a API estiver fora, nada muda: a Home fica
// exatamente como esta no HTML.
//
// Importante: nao mexemos no Home.html. Tambem avisamos o script.js (carrossel)
// que ele deve esperar, pois as imagens dos slides chegam depois.

(() => {
  const API = "http://localhost:8080";

  // avisa o script.js que a Home vai montar o carrossel dinamicamente
  window.homeDinamico = true;

  const imagem = (arquivo) => "../images/" + arquivo;

  async function carregar() {
    try {
      const [respostaConfig, respostaDestaques] = await Promise.all([
        fetch(API + "/api/home", { credentials: "include" }),
        fetch(API + "/api/produtos/destaques", { credentials: "include" })
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
      // com ou sem API, inicia o carrossel (com as imagens que estiverem no .track)
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
          <img src="${imagem(p.imagem)}" class="imagem-2" onerror="this.src='../images/guest.png'">
          <i class="bi bi-heart"></i>
          <i class="bi bi-bag"></i>
        </div>
        <p class="nome">${p.nome}</p>
        <hr>
        <strong>R$ ${preco}</strong>
      `;
      card.addEventListener("click", (event) => {
        if (event.target.closest("i")) return; // clicar no coração/sacolinha nao navega
        window.location.href = "Produto.html?id=" + p.idProduto;
      });
      lista.appendChild(card);
    });
  }

  carregar();
})();
