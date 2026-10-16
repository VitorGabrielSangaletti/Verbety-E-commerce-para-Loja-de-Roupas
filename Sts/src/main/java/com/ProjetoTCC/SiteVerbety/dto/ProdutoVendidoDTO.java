package com.ProjetoTCC.SiteVerbety.dto;

import com.ProjetoTCC.SiteVerbety.model.Produto;

// Usado na tela de Destaques: um produto e quanto ele ja vendeu
public class ProdutoVendidoDTO {

    private Produto produto;
    private Long totalVendido;

    public ProdutoVendidoDTO(Produto produto, Long totalVendido) {
        this.produto = produto;
        this.totalVendido = totalVendido;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public Long getTotalVendido() {
        return totalVendido;
    }

    public void setTotalVendido(Long totalVendido) {
        this.totalVendido = totalVendido;
    }
}
