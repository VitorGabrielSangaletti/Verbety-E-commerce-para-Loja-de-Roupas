(function () {
  const botao = document.getElementById("btnBusca");
  const header = document.querySelector("header");
  if (!botao || !header) return;

  const painel = document.createElement("div");
  painel.className = "busca-painel";
  painel.innerHTML = `
    <input type="search" id="buscaHeader" placeholder="Buscar produto..." autocomplete="off" aria-label="Buscar produto" />
    <p class="busca-dica" id="buscaDica"></p>
  `;
  header.appendChild(painel);

  const input = painel.querySelector("#buscaHeader");
  const dica = painel.querySelector("#buscaDica");

  const filtraNaPagina = () => typeof window.filtrarPorBusca === "function";

  function abrir() {
    painel.classList.add("aberto");
    botao.setAttribute("aria-expanded", "true");
    input.focus();
    input.select();
  }

  function fechar(limpar) {
    painel.classList.remove("aberto");
    botao.setAttribute("aria-expanded", "false");
    if (limpar) {
      input.value = "";
      dica.textContent = "";
      if (filtraNaPagina()) window.filtrarPorBusca("");
    }
  }

  function irParaCatalogo() {
    const texto = input.value.trim();
    window.location.href =
      "Catalogo.html" + (texto ? "?busca=" + encodeURIComponent(texto) : "");
  }

  botao.addEventListener("click", (evento) => {
    evento.preventDefault();
    if (painel.classList.contains("aberto")) {
      fechar(true);
    } else {
      abrir();
    }
  });

  input.addEventListener("input", () => {
    if (filtraNaPagina()) {
      dica.textContent = "";
      window.filtrarPorBusca(input.value);
    } else {
      dica.textContent = "Pressione Enter para buscar no catálogo.";
    }
  });

  input.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      if (filtraNaPagina()) {
        fechar(false);
      } else {
        irParaCatalogo();
      }
    }

    if (evento.key === "Escape") {
      fechar(true);
    }
  });

  document.addEventListener("click", (evento) => {
    if (!painel.contains(evento.target) && !botao.contains(evento.target)) {
      fechar(false);
    }
  });
})();
