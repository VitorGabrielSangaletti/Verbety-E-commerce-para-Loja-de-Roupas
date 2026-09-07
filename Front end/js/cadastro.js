document
  .getElementById("cadastroForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "";
    mensagem.className = "mensagem";

    try {
const resposta = await fetch("http://localhost:8080/api/auth/cadastro-cliente", { method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nome, cpf, email, telefone, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        mensagem.textContent = dados.erro || "Falha no cadastro";
        mensagem.classList.add("erro");
        return;
      }

      mensagem.textContent =
        "Cadastro realizado! Redirecionando para o login...";
      mensagem.classList.add("sucesso");

      setTimeout(() => {
        window.location.href = "Login.html";
      }, 1000);
    } catch (error) {
      mensagem.textContent = "Erro de conexão com o servidor";
      mensagem.classList.add("erro");
    }
  });
