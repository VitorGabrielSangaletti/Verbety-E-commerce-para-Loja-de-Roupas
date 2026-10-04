// IIFE: evita conflito de escopo com o "const API" das paginas
// (scripts classic compartilham o escopo global)
(() => {
const API = "http://localhost:8080";

async function montarSubmenuCategorias() {
  const lista = document.querySelector("nav ul");
  if (!lista || document.querySelector(".nav-cat")) return;

  const resposta = await fetch(API + "/api/categorias", {
    credentials: "include",
  });
  if (!resposta.ok) return;

  const categorias = await resposta.json();
  const atual = new URLSearchParams(window.location.search).get("categoria");

  // procura o <li> cujo link aponta para Catalogo.html
  let item = null;
  lista.querySelectorAll("li").forEach((li) => {
    const link = li.querySelector("a.lv");
    if (link && /Catalogo\.html$/.test(link.getAttribute("href") || "")) {
      item = li;
    }
  });

  if (!item) return;

  item.classList.add("nav-cat");

  let html = '<ul class="submenu">';
  html += '<li><a href="Catalogo.html">Todos os produtos</a></li>';

  categorias.forEach((cat) => {
    const ativo = String(cat.idCategoria) === atual ? " ativo" : "";
    html +=
      '<li><a class="' +
      ativo +
      '" href="Catalogo.html?categoria=' +
      cat.idCategoria +
      '">' +
      cat.nome +
      "</a></li>";
  });

  html += "</ul>";
  item.insertAdjacentHTML("beforeend", html);
}

montarSubmenuCategorias();
})();