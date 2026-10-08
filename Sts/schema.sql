-- ============================================================
-- SITE VERBETY - Estrutura do Banco de Dados
-- Reflete o schema REAL usado pelo backend (Hibernate ddl-auto=update)
-- Charset: utf8mb4 / utf8mb4_unicode_ci (acentos corretos)
--
-- ATENCAO: o Spring NAO executa este arquivo automaticamente.
-- Ele serve como referencia/documentacao.
-- Para recriar o banco com TODOS os dados na escola, use o
-- arquivo banco_verbety.sql (gera CREATE DATABASE + tabelas + dados).
-- ============================================================

USE siteverbety;

-- --------------------------------------------------------
-- Tabela: categoria
-- Categorias reais: 1=Vestidos, 3=Roupas, 5=Acessórios
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabela: produto
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS produto (
    id_produto BIGINT NOT NULL AUTO_INCREMENT,
    id_categoria BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DOUBLE NOT NULL,
    imagem VARCHAR(255) NOT NULL,
    disponivel TINYINT(1) DEFAULT NULL,
    destaque BIT(1) DEFAULT NULL,
    PRIMARY KEY (id_produto),
    KEY id_categoria (id_categoria),
    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabela: produto_tamanho
-- Estoque por tamanho de cada produto (PP, P, M, G, GG)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS produto_tamanho (
    id_produto_tamanho BIGINT NOT NULL AUTO_INCREMENT,
    quantidade INT NOT NULL,
    tamanho VARCHAR(10) NOT NULL,
    id_produto BIGINT NOT NULL,
    PRIMARY KEY (id_produto_tamanho),
    KEY id_produto (id_produto),
    CONSTRAINT fk_produto_tamanho_produto
        FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabela: usuario
-- Clientes cadastrados no site
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY cpf (cpf),
    UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabela: funcionario
-- Funcionários/Administradores que acessam o painel
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS funcionario (
    id_funcionario BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_funcionario),
    UNIQUE KEY email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabela: pedido
-- Pedidos feitos pelos clientes (sem entrega - venda direta)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido (
    id_pedido BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    data_pedido DATETIME DEFAULT NULL,
    valor_total DECIMAL(38,2) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    forma_pagamento VARCHAR(20) DEFAULT NULL,
    observacao TEXT,
    PRIMARY KEY (id_pedido),
    KEY id_usuario (id_usuario),
    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabela: item_pedido
-- Itens de cada pedido (produto + tamanho + quantidade)
-- NOTE: table real e item_pedido (o Hibernate usa snake_case)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS item_pedido (
    id_item_pedido BIGINT NOT NULL AUTO_INCREMENT,
    preco_unidade DECIMAL(38,2) NOT NULL,
    quantidade INT NOT NULL,
    subtotal DECIMAL(38,2) NOT NULL,
    id_pedido BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    tamanho VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (id_item_pedido),
    KEY id_pedido (id_pedido),
    KEY id_produto (id_produto),
    CONSTRAINT fk_item_pedido_pedido
        FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
    CONSTRAINT fk_item_pedido_produto
        FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Dados iniciais (opcionais - rode se quiser)
-- ============================================================

-- Categorias reais (ids usados pelo front)
INSERT INTO categoria (id_categoria, nome) VALUES (1, 'Vestidos'), (3, 'Roupas'), (5, 'Acessórios');

-- Contas de administrador (senhas em hash bcrypt)
-- IMPORTANTE: troque as senhas depois de criar o banco.
INSERT INTO funcionario (nome, email, senha, cargo) VALUES
('Carlos Admin', 'carlos@admin.com', '$2a$10$eRKsFexaFTbyrdoxC73DquPown4R8PlLNE7WOn6XceSN9qVY8cGWa', 'Gerente'),
('Admin Verbety', 'admin@verbety.com', '$2a$10$o/dDr/.z5VKDQKDFuEurvexdey/rEcGqD.mYJyofDVuqSlUORMOdy', 'Gerente');