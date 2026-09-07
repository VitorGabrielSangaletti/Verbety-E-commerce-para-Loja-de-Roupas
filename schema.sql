-- =============================================
-- SITE VERBETY - Criação do Banco de Dados
-- Execute este script no MySQL (Workbench ou terminal)
-- =============================================

USE siteverbety;

-- --------------------------------------------------------
-- Tabela: categoria
-- Categorias de produtos (ex: Camisetas, Calças, Acessórios)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tabela: produto
-- Produtos da loja (roupas e acessórios)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS produto (
    id_produto BIGINT NOT NULL AUTO_INCREMENT,
    id_categoria BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DOUBLE NOT NULL,
    imagem VARCHAR(255) NOT NULL,
    disponivel TINYINT(1) DEFAULT 1,
    PRIMARY KEY (id_produto),
    CONSTRAINT fk_produto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tabela: usuario
-- Clientes que fazem cadastro no site
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME,
    PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_cpf UNIQUE (cpf),
    CONSTRAINT uq_usuario_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
    CONSTRAINT uq_funcionario_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tabela: pedido
-- Pedidos feitos pelos clientes (sem entrega - venda direta)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido (
    id_pedido BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    data_pedido DATETIME,
    valor_total DECIMAL(10, 2),
    status VARCHAR(50),
    forma_pagamento VARCHAR(20),
    observacao TEXT,
    PRIMARY KEY (id_pedido),
    CONSTRAINT fk_pedido_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Tabela: itemPedido
-- Itens de cada pedido (produtos + quantidade)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS itemPedido (
    id_item_pedido BIGINT NOT NULL AUTO_INCREMENT,
    id_pedido BIGINT NOT NULL,
    id_produto BIGINT NOT NULL,
    quantidade INT NOT NULL,
    preco_unidade DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id_item_pedido),
    CONSTRAINT fk_item_pedido
        FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
    CONSTRAINT fk_item_produto
        FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- Dados iniciais (opcional - pode rodar se quiser)
-- =============================================

-- Categorias iniciais (exemplo de loja de roupas)
INSERT INTO categoria (nome) VALUES ('Camisetas');
INSERT INTO categoria (nome) VALUES ('Calças');
INSERT INTO categoria (nome) VALUES ('Moletons');
INSERT INTO categoria (nome) VALUES ('Acessórios');
