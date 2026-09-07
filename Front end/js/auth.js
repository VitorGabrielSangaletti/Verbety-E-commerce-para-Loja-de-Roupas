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
    const authButtons = document.querySelector(".auth-buttons");

    const linkAdmin = dados.tipo === "ADMIN"
        ? '<a href="Admin.html" class="btn-auth btn-outline">Admin</a>'
        : "";

    authButtons.innerHTML = `
        ${linkAdmin}
        <a href="#" id="btnSair" class="btn-auth btn-black">Sair</a>
    `;

    document.getElementById("btnSair").addEventListener("click", (event) => {
        event.preventDefault();
        fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include"
        }).then(() => {
            window.location.href = "Home.html";
        });
    });
})
.catch(erro => {
    console.log("[auth] falha na conexao:", erro.message);
});
