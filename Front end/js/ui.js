// Pop-ups e avisos do site, no lugar do alert/confirm nativo do navegador.
(function () {
  let overlayAtual = null;

  const TITULOS = {
    info: "Aviso",
    aviso: "Atenção",
    erro: "Ops!",
    sucesso: "Tudo certo",
    confirmacao: "Confirmação",
  };

  const SIMBOLOS = {
    info: "i",
    aviso: "!",
    erro: "!",
    sucesso: "✓",
    confirmacao: "?",
  };

  function criarElemento(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  function fechar(resultado) {
    if (!overlayAtual) return;
    const { overlay, resolver, focoAnterior } = overlayAtual;
    overlayAtual = null;
    overlay.classList.remove("ui-overlay--visivel");
    document.removeEventListener("keydown", aoTeclar);
    setTimeout(() => {
      overlay.remove();
      if (focoAnterior && typeof focoAnterior.focus === "function") {
        focoAnterior.focus();
      }
    }, 160);
    resolver(resultado);
  }

  function aoTeclar(evento) {
    if (!overlayAtual) return;
    if (evento.key === "Escape") {
      evento.preventDefault();
      fechar(!overlayAtual.temCancelar);
    }
    if (evento.key === "Tab") {
      const botoes = Array.from(
        overlayAtual.overlay.querySelectorAll(".ui-btn")
      );
      if (botoes.length === 0) return;
      const primeiro = botoes[0];
      const ultimo = botoes[botoes.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }
  }

  function abrir(opcoes) {
    const {
      tipo = "info",
      titulo,
      mensagem,
      textoOk = "OK",
      textoCancelar = "Cancelar",
      confirmacao = false,
      perigo = false,
    } = opcoes;

    if (overlayAtual) fechar(false);

    return new Promise((resolver) => {
      const overlay = criarElemento("div", "ui-overlay");
      overlay.setAttribute("data-tipo", tipo);

      const modal = criarElemento("div", "ui-modal");
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "ui-modal-titulo");

      const simbolo = criarElemento(
        "div",
        "ui-modal__simbolo",
        SIMBOLOS[tipo] || "i"
      );
      simbolo.setAttribute("aria-hidden", "true");

      const tituloEl = criarElemento(
        "h3",
        "ui-modal__titulo",
        titulo || TITULOS[tipo] || TITULOS.info
      );
      tituloEl.id = "ui-modal-titulo";

      const mensagemEl = criarElemento("p", "ui-modal__mensagem", mensagem);

      const acoes = criarElemento("div", "ui-modal__acoes");

      const botoes = [];
      if (confirmacao) {
        const cancelar = criarElemento(
          "button",
          "ui-btn ui-btn--secundario",
          textoCancelar
        );
        cancelar.type = "button";
        cancelar.addEventListener("click", () => fechar(false));
        botoes.push(cancelar);
        acoes.appendChild(cancelar);
      }

      const ok = criarElemento(
        "button",
        "ui-btn ui-btn--primario" + (perigo ? " ui-btn--perigo" : ""),
        textoOk
      );
      ok.type = "button";
      ok.addEventListener("click", () => fechar(true));
      botoes.push(ok);
      acoes.appendChild(ok);

      modal.append(simbolo, tituloEl, mensagemEl, acoes);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      overlayAtual = {
        overlay,
        resolver,
        focoAnterior: document.activeElement,
        temCancelar: confirmacao,
      };

      overlay.addEventListener("mousedown", (evento) => {
        if (evento.target === overlay) {
          fechar(!confirmacao);
        }
      });

      document.addEventListener("keydown", aoTeclar);

      requestAnimationFrame(() => overlay.classList.add("ui-overlay--visivel"));
      ok.focus();
    });
  }

  function alerta(mensagem, opcoes) {
    return abrir({
      ...(opcoes || {}),
      mensagem,
      confirmacao: false,
      textoOk: (opcoes && opcoes.textoOk) || "Entendi",
    });
  }

  function confirmar(mensagem, opcoes) {
    return abrir({
      ...(opcoes || {}),
      mensagem,
      tipo: (opcoes && opcoes.tipo) || "confirmacao",
      confirmacao: true,
      textoOk: (opcoes && opcoes.textoOk) || "Confirmar",
    }).then((resultado) => resultado === true);
  }

  function toast(mensagem, tipo) {
    let container = document.querySelector(".ui-toast-container");
    if (!container) {
      container = criarElemento("div", "ui-toast-container");
      document.body.appendChild(container);
    }

    const aviso = criarElemento("div", "ui-toast");
    aviso.setAttribute("data-tipo", tipo || "info");
    aviso.setAttribute("role", "status");

    const barra = criarElemento("span", "ui-toast__barra");
    barra.setAttribute("aria-hidden", "true");
    const texto = criarElemento("span", "ui-toast__texto", mensagem);

    aviso.append(barra, texto);
    container.appendChild(aviso);

    requestAnimationFrame(() => aviso.classList.add("ui-toast--visivel"));

    const remover = () => {
      aviso.classList.remove("ui-toast--visivel");
      setTimeout(() => aviso.remove(), 260);
    };

    const tempo = setTimeout(remover, 4000);
    aviso.addEventListener("click", () => {
      clearTimeout(tempo);
      remover();
    });
  }

  window.UI = { alerta, confirmar, toast };
})();
