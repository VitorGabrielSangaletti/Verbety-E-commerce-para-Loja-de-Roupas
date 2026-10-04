//verifica quem ta logado, tipo usuario ou funcianario
fetch("http://localhost:8080/api/auth/me", {
    method: "GET",
    credentials: "include"
})
.then(resposta => {
    if (!resposta.ok) {
        console.log("[auth] nao logado (status " + resposta.status + ")");
        return null;
    }
    return resposta.json();
})
.then(dados => {
    if (!dados || !dados.tipo) return;

    console.log("[auth] logado como:", dados.tipo);
    const linkConta = document.getElementById("linkConta");
    const iconeConta = document.getElementById("iconeConta");

    if (linkConta && iconeConta) {
        linkConta.href = "#";
        linkConta.setAttribute("aria-label", "Sair");
        iconeConta.classList.remove("bi-person");
        iconeConta.classList.add("bi-box-arrow-right");

        linkConta.addEventListener("click", (event) => {
            event.preventDefault();
            fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include"
            }).then(() => {
                window.location.href = "Home.html";
            });
        });
    }

    const itemAdmin = dados.tipo === "ADMIN"
        ? '<li><a class="lv" href="Admin.html">Admin</a></li>'
        : "";
    const lista = document.querySelector("nav ul");
    if (itemAdmin && lista) {
        lista.insertAdjacentHTML("beforeend", itemAdmin);
    }
});
