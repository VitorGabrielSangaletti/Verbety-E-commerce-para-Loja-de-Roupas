const API = "http://localhost:8080";

let editandoId = null;
let produtosCache = [];
const TAMANHOS = ["PP", "P", "M", "G", "GG"];

/* ============================ Utilidades ============================ */

let toastTimer = null;
function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById("toast");
    toast.textContent = mensagem;
    toast.className = "toast visivel " + (tipo || "sucesso");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visivel"), 2800);
}

function precoBR(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
}

/* ============================ Acesso ============================ */

async function verificarAdmin() {
    try {
        const resposta = await fetch(API + "/api/auth/me", { credentials: "include" });
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);
        const dados = await resposta.json();
        if (!dados || dados.tipo !== "ADMIN") throw new Error("tipo " + (dados && dados.tipo));
        return true;
    } catch (erro) {
        console.log("[admin] acesso negado:", erro.message);
        document.getElementById("acessoNegado").style.display = "block";
        return false;
    }
}

/* ============================ Navegação ============================ */

function ligarMenu() {
    document.querySelectorAll(".menu-item").forEach((botao) => {
        botao.addEventListener("click", () => {
            document.querySelectorAll(".menu-item").forEach((b) => b.classList.remove("ativo"));
            document.querySelectorAll(".secao-admin").forEach((s) => s.classList.remove("ativo"));
            botao.classList.add("ativo");
            document.getElementById("secao-" + botao.dataset.secao).classList.add("ativo");
        });
    });
}

/* ============================ PRODUTOS ============================ */

async function carregarCategorias() {
    const resposta = await fetch(API + "/api/categorias", { credentials: "include" });
    const categorias = await resposta.json();

    // select do formulário de produto
    const select = document.getElementById("categoria");
    select.innerHTML = "";
    categorias.forEach((cat) => {
        const opcao = document.createElement("option");
        opcao.value = cat.idCategoria;
        opcao.textContent = cat.nome;
        select.appendChild(opcao);
    });

    // tabela de categorias
    const tbody = document.getElementById("listaCategorias");
    tbody.innerHTML = "";
    if (categorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhuma categoria cadastrada.</td></tr>';
        return;
    }
    categorias.forEach((cat) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${cat.idCategoria}</td>
            <td>${cat.nome}</td>
            <td><div class="acoes-tabela">
                <button type="button" class="btn-tabela perigo" data-acao="excluir-categoria" data-id="${cat.idCategoria}">Excluir</button>
            </div></td>
        `;
        tbody.appendChild(tr);
    });
}

async function carregarProdutos() {
    const resposta = await fetch(API + "/api/produtos", { credentials: "include" });
    produtosCache = await resposta.json();
    const tbody = document.getElementById("listaProdutos");
    tbody.innerHTML = "";

    if (produtosCache.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    produtosCache.forEach((p) => {
        const tamanhos = (p.tamanhos || [])
            .map((t) => `${t.tamanho}: ${t.quantidade}`)
            .join(", ") || "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.idProduto}</td>
            <td><img class="mini-img" src="../images/${p.imagem}" onerror="this.src='../images/guest.png'"></td>
            <td>${p.nome}${p.destaque ? ' <i class="bi bi-star-fill" style="color:#ffc936"></i>' : ""}</td>
            <td>R$ ${precoBR(p.preco)}</td>
            <td>${tamanhos}</td>
            <td><div class="acoes-tabela">
                <button type="button" class="btn-tabela" data-acao="editar" data-id="${p.idProduto}">Editar</button>
                <button type="button" class="btn-tabela perigo" data-acao="excluir" data-id="${p.idProduto}">Excluir</button>
            </div></td>
        `;
        tbody.appendChild(tr);
    });
}

async function editarProduto(id) {
    const resposta = await fetch(API + "/api/produtos/" + id, { credentials: "include" });
    const p = await resposta.json();

    editandoId = id;
    document.getElementById("formTitulo").innerHTML = '<i class="bi bi-pencil-square"></i> Editar produto #' + id;
    document.getElementById("nome").value = p.nome;
    document.getElementById("descricao").value = p.descricao || "";
    document.getElementById("preco").value = p.preco;
    document.getElementById("imagem").value = p.imagem;
    document.getElementById("categoria").value = p.categoria.idCategoria;
    document.getElementById("destaque").checked = !!p.destaque;
    document.getElementById("disponivel").checked = !!p.disponivel;

    TAMANHOS.forEach((t) => {
        const achou = (p.tamanhos || []).find((x) => x.tamanho === t);
        document.getElementById("qtd_" + t).value = achou ? achou.quantidade : "";
    });

    document.getElementById("btnSalvar").textContent = "Salvar alterações";
    document.getElementById("btnCancelar").style.display = "inline-flex";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function limparForm() {
    editandoId = null;
    document.getElementById("formProduto").reset();
    document.getElementById("formTitulo").innerHTML = '<i class="bi bi-plus-circle"></i> Novo produto';
    document.getElementById("btnSalvar").textContent = "Adicionar produto";
    document.getElementById("btnCancelar").style.display = "none";
}

function montarTamanhos() {
    const tamanhos = [];
    TAMANHOS.forEach((t) => {
        const valor = document.getElementById("qtd_" + t).value;
        if (valor !== "") {
            tamanhos.push({ tamanho: t, quantidade: parseInt(valor) });
        }
    });
    return tamanhos;
}

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
        mostrarToast("Erro ao salvar (" + resposta.status + "). Você está logado como funcionário?", "erro");
        return;
    }

    mostrarToast(editandoId ? "Produto atualizado!" : "Produto adicionado!");
    limparForm();
    carregarProdutos();
    carregarDestaquesAdmin();
});

async function excluirProduto(id) {
    if (!confirm("Excluir o produto #" + id + "?")) return;

    const resposta = await fetch(API + "/api/produtos/" + id, {
        method: "DELETE",
        credentials: "include"
    });

    if (!resposta.ok) {
        mostrarToast("Erro ao excluir (" + resposta.status + ").", "erro");
        return;
    }
    mostrarToast("Produto excluído.");
    carregarProdutos();
    carregarDestaquesAdmin();
}

document.getElementById("btnCancelar").addEventListener("click", limparForm);

/* ============================ CATEGORIAS ============================ */

document.getElementById("formCategoria").addEventListener("submit", async (event) => {
    event.preventDefault();
    const nome = document.getElementById("nomeCategoria").value.trim();
    if (!nome) return;

    const resposta = await fetch(API + "/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nome })
    });

    if (!resposta.ok) {
        mostrarToast("Erro ao criar categoria (" + resposta.status + ").", "erro");
        return;
    }
    document.getElementById("formCategoria").reset();
    mostrarToast("Categoria criada!");
    carregarCategorias();
});

async function excluirCategoria(id) {
    if (!confirm("Excluir a categoria #" + id + "?\nSó funciona se não houver produtos ligados a ela.")) return;

    const resposta = await fetch(API + "/api/categorias/" + id, {
        method: "DELETE",
        credentials: "include"
    });

    if (!resposta.ok) {
        mostrarToast("Não foi possível excluir (talvez tenha produtos nela).", "erro");
        return;
    }
    mostrarToast("Categoria excluída.");
    carregarCategorias();
}

/* ============================ HOME ============================ */

async function carregarHome() {
    const resposta = await fetch(API + "/api/home", { credentials: "include" });
    if (!resposta.ok) {
        mostrarToast("Não foi possível carregar a configuração da Home.", "erro");
        return;
    }
    const cfg = await resposta.json();

    document.getElementById("bannerImagem").value = cfg.bannerImagem || "";
    document.getElementById("bannerTexto").value = cfg.bannerTexto || "";
    document.getElementById("carrossel").value = (cfg.carrossel || []).join("\n");

    const cards = cfg.cards || [];
    [0, 1, 2].forEach((i) => {
        const c = cards[i] || {};
        document.getElementById("card" + i + "_imagem").value = c.imagem || "";
        document.getElementById("card" + i + "_titulo").value = c.titulo || "";
        document.getElementById("card" + i + "_texto").value = c.texto || "";
    });
}

document.getElementById("formHome").addEventListener("submit", async (event) => {
    event.preventDefault();

    const corpo = {
        bannerImagem: document.getElementById("bannerImagem").value.trim(),
        bannerTexto: document.getElementById("bannerTexto").value.trim(),
        carrossel: document.getElementById("carrossel").value
            .split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== ""),
        cards: [0, 1, 2].map((i) => ({
            imagem: document.getElementById("card" + i + "_imagem").value.trim(),
            titulo: document.getElementById("card" + i + "_titulo").value.trim(),
            texto: document.getElementById("card" + i + "_texto").value.trim()
        }))
    };

    const resposta = await fetch(API + "/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(corpo)
    });

    if (!resposta.ok) {
        mostrarToast("Erro ao salvar a Home (" + resposta.status + ").", "erro");
        return;
    }
    mostrarToast("Home atualizada! Recarregue a Home para ver.");
});

async function carregarDestaquesAdmin() {
    const resposta = await fetch(API + "/api/produtos", { credentials: "include" });
    const produtos = await resposta.json();
    const container = document.getElementById("listaDestaquesAdmin");
    container.innerHTML = "";

    if (produtos.length === 0) {
        container.innerHTML = '<p class="dica">Nenhum produto cadastrado.</p>';
        return;
    }

    produtos.forEach((p) => {
        const item = document.createElement("label");
        item.className = "destaque-item";
        item.innerHTML = `
            <img src="../images/${p.imagem}" onerror="this.src='../images/guest.png'">
            <span class="nome-produto">${p.nome}</span>
            <input type="checkbox" ${p.destaque ? "checked" : ""} data-id="${p.idProduto}">
        `;
        const check = item.querySelector("input");
        check.addEventListener("change", () => alternarDestaque(p, check));
        container.appendChild(item);
    });
}

async function alternarDestaque(produto, checkbox) {
    const original = !!produto.destaque;
    const novo = checkbox.checked;

    const corpo = {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        imagem: produto.imagem,
        disponivel: produto.disponivel,
        destaque: novo,
        categoria: produto.categoria,
        tamanhos: produto.tamanhos
    };

    const resposta = await fetch(API + "/api/produtos/" + produto.idProduto, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(corpo)
    });

    if (!resposta.ok) {
        checkbox.checked = original;
        mostrarToast("Erro ao atualizar destaque (" + resposta.status + ").", "erro");
        return;
    }
    produto.destaque = novo;
    mostrarToast(novo ? "Produto marcado como destaque." : "Produto removido dos destaques.");
    carregarProdutos();
}

/* ============================ Ações da tabela (delegação) ============================ */

document.getElementById("listaProdutos").addEventListener("click", (event) => {
    const botao = event.target.closest("button[data-acao]");
    if (!botao) return;
    const id = parseInt(botao.dataset.id);
    if (botao.dataset.acao === "editar") editarProduto(id);
    if (botao.dataset.acao === "excluir") excluirProduto(id);
});

document.getElementById("listaCategorias").addEventListener("click", (event) => {
    const botao = event.target.closest('button[data-acao="excluir-categoria"]');
    if (botao) excluirCategoria(parseInt(botao.dataset.id));
});

/* ============================ Início ============================ */

async function iniciar() {
    if (!(await verificarAdmin())) return;

    document.getElementById("adminSidebar").style.display = "block";
    document.getElementById("painelAdmin").style.display = "block";

    ligarMenu();
    await carregarCategorias();
    carregarProdutos();
    carregarHome();
    carregarDestaquesAdmin();
}

iniciar();
