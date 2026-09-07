//lista que vai mostrar os texto embaixo do carrossel

window.teamMembers = [
    { name: "VERBETY", role: "" },
    { name: "VERBETY", role: "" },
    { name: "VERBETY", role: "" },
    { name: "VERBETY", role: "" },
    { name: "VERBETY", role: "" },
    { name: "VERBETY", role: "" }
];

//preenche o carrossel com os produtos em destaque do banco
const API_HOME = "http://localhost:8080";

fetch(API_HOME + "/api/produtos/destaques")
.then(resposta => resposta.json())
.then(produtos => {
    if (!produtos.length) return;

    const cards = document.querySelectorAll(".carousel-track .card");

    cards.forEach((card, i) => {
        //se tiver menos de 6 destaques repete a partir do inicio
        const p = produtos[i % produtos.length];

        const img = card.querySelector(".card-img img");
        const titulo = card.querySelector(".product-title");
        const preco = card.querySelector(".product-price");
        const parcelas = card.querySelector(".product-installments");

        img.onerror = () => { img.src = "../images/guest.png"; };
        img.src = "../images/" + p.imagem;
        img.alt = p.nome;

        titulo.textContent = p.nome;

        const precoFmt = Number(p.preco).toFixed(2).replace(".", ",");
        preco.textContent = "R$ " + precoFmt;
        parcelas.textContent = "ou 12x de R$ " + (Number(p.preco) / 12).toFixed(2).replace(".", ",");

        //quando clicar no card do centro vai pra pagina do produto
        card.onclick = () => {
            if (card.classList.contains("center")) {
                window.location.href = "Produto.html?id=" + p.idProduto;
            }
        };
    });
})
.catch(erro => {
    console.log("[home] falha ao buscar destaques:", erro.message);
});
