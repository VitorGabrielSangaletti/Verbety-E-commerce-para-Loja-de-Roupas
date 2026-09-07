// Tipo de login, tipo cliente, funcionario ou adimin
const btnCliente = document.getElementById("btnCliente");
const btnFuncionario = document.getElementById("btnFuncionario");

let tipoLogin = "USUARIO"; // começa como cliente

btnCliente.addEventListener("click", () => {
  tipoLogin = "USUARIO";
  btnCliente.classList.add("active");
  btnFuncionario.classList.remove("active");
  document.getElementById("mensagem").textContent = "";
});

btnFuncionario.addEventListener("click", () => {
  tipoLogin = "ADMIN";
  btnFuncionario.classList.add("active");
  btnCliente.classList.remove("active");
  document.getElementById("mensagem").textContent = "";
});

// Envia o login
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "";
    mensagem.className = "mensagem";

    const url =
      tipoLogin === "USUARIO"
        ? "http://localhost:8080/api/auth/login"
        : "http://localhost:8080/api/auth/login-admin";
    try {
      const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        mensagem.textContent = dados.erro || "Falha no login";
        mensagem.classList.add("erro");
        return;
      }

      mensagem.textContent = dados.mensagem;
      mensagem.classList.add("sucesso");

      setTimeout(() => {
        window.location.href = "Home.html";
      }, 800);
    } catch (error) {
      mensagem.textContent = "Erro de conexão com o servidor";
      mensagem.classList.add("erro");
    }
  });
