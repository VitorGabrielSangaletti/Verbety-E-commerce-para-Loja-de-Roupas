const API = "http://localhost:8080";

let editandoId = null;
const TAMANHOS = ["PP", "P", "M", "G", "GG"];

// confere se quem ta logado e admin
async function verificarAdmin() {
    const resposta = await fetch(API + "/api/auth/me", { credentials: "include" });
    const dados = await resposta.json();
    if (dados.tipo !== "ADMIN") {
        document.getElementById("acessoNegado").style.display = "block";
        document.getElementById("painelAdmin").style.display = "none";
        return false;
    }
    return true;
}

// carrega as categorias no select
async function carregarCategorias() {
    const resposta = await fetch(API + "/api/categorias", { credentials: "include" });
    const categorias = await resposta.json();
    const select = document.getElementById("categoria");
    categorias.forEach(cat => {
        const opcao = document.createElement("option");
        opcao.value = cat.idCategoria;
        opcao.textContent = cat.nome;
        select.appendChild(opcao);
    });
}

// monta a tabela de produtos
async function carregarProdutos() {
    const resposta = await fetch(API + "/api/produtos", { credentials: "include" });
    const produtos = await resposta.json();
    const tbody = document.getElementById("listaProdutos");
    tbody.innerHTML = "";

    produtos.forEach(p => {
        const preco = Number(p.preco).toFixed(2).replace(".", ",");
        const tamanhos = (p.tamanhos || [])
            .map(t => `${t.tamanho}: ${t.quantidade}`)
            .join(", ") || "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.idProduto}</td>
            <td><img class="mini-img" src="../images/${p.imagem}" onerror="this.src='../images/guest.png'"></td>
            <td>${p.nome}</td>
            <td>R$ ${preco}</td>
            <td>${tamanhos}</td>
            <td>
                <button type="button" onclick="editar(${p.idProduto})">Editar</button>
                <button type="button" class="btn-excluir" onclick="excluir(${p.idProduto})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// pega o produto da API e preenche o formulario
async function editar(id) {
    const resposta = await fetch(API + "/api/produtos/" + id, { credentials: "include" });
    const p = await resposta.json();

    editandoId = id;
    document.getElementById("formTitulo").textContent = "Editar produto #" + id;
    document.getElementById("nome").value = p.nome;
    document.getElementById("descricao").value = p.descricao || "";
    document.getElementById("preco").value = p.preco;
    document.getElementById("imagem").value = p.imagem;
    document.getElementById("categoria").value = p.categoria.idCategoria;
    document.getElementById("destaque").checked = !!p.destaque;
    document.getElementById("disponivel").checked = !!p.disponivel;

    TAMANHOS.forEach(t => {
        const achou = (p.tamanhos || []).find(x => x.tamanho === t);
        document.getElementById("qtd_" + t).value = achou ? achou.quantidade : "";
    });

    document.getElementById("btnSalvar").textContent = "Salvar alterações";
    document.getElementById("btnCancelar").style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// limpa o formulario 
function limparForm() {
    editandoId = null;
    document.getElementById("formProduto").reset();
    document.getElementById("formTitulo").textContent = "Novo produto";
    document.getElementById("btnSalvar").textContent = "Adicionar produto";
    document.getElementById("btnCancelar").style.display = "none";
}

// monta o array de tamanhos a partir dos inputs
function montarTamanhos() {
    const tamanhos = [];
    TAMANHOS.forEach(t => {
        const valor = document.getElementById("qtd_" + t).value;
        if (valor !== "") {
            tamanhos.push({ tamanho: t, quantidade: parseInt(valor) });
        }
    });
    return tamanhos;
}

// salva 
document.getElementById("formProduto").addEventListener("submit", async (event) => {
    event.preventDefault();

    const corpo = {
        nome: document.getElementById("nome").value,
        descricao: document.getElementById("descricao").value,
        preco: parseFloat(document.getElementById("preco").value),
        imagem: document.getElementById("imagem").value,
        disponivel: document.getElementById("disponivel").checked,
        destaque: document.getElementById("destaque").checked,
        categoria: { idCategoria: parseInt(document.getElementById("categoria").value) },
        tamanhos: montarTamanhos()
    };

    const url = editandoId ? API + "/api/produtos/" + editandoId : API + "/api/produtos";
    const metodo = editandoId ? "PUT" : "POST";

    const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(corpo)
    });

    if (!resposta.ok) {
        alert("Erro ao salvar (" + resposta.status + "). Você está logado como Funcionário?");
        return;
    }

    alert(editandoId ? "Produto atualizado!" : "Produto adicionado!");
    limparForm();
    carregarProdutos();
});

// exclui o produto
async function excluir(id) {
    if (!confirm("Excluir o produto #" + id + "?")) return;

    const resposta = await fetch(API + "/api/produtos/" + id, {
        method: "DELETE",
        credentials: "include"
    });

    if (!resposta.ok) {
        alert("Erro ao excluir (" + resposta.status + ").");
        return;
    }
    carregarProdutos();
}

document.getElementById("btnCancelar").addEventListener("click", limparForm);

async function iniciar() {
    if (await verificarAdmin()) {
        await carregarCategorias();
        carregarProdutos();
    }
}

iniciar();