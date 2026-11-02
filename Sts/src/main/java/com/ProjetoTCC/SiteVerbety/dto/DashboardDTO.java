package com.ProjetoTCC.SiteVerbety.dto;

import java.math.BigDecimal;
import java.util.List;

// Resposta do dashboard do admin (bem simples: números gerais e duas listas)
public class DashboardDTO {

    private BigDecimal faturamentoTotal;
    private long totalPedidos;
    private BigDecimal ticketMedio;
    private long itensVendidos;
    private List<ProdutoVendidoDTO> maisVendidos;
    private List<ItemEstoque> estoqueBaixo;

    public BigDecimal getFaturamentoTotal() {
        return faturamentoTotal;
    }

    public void setFaturamentoTotal(BigDecimal faturamentoTotal) {
        this.faturamentoTotal = faturamentoTotal;
    }

    public long getTotalPedidos() {
        return totalPedidos;
    }

    public void setTotalPedidos(long totalPedidos) {
        this.totalPedidos = totalPedidos;
    }

    public BigDecimal getTicketMedio() {
        return ticketMedio;
    }

    public void setTicketMedio(BigDecimal ticketMedio) {
        this.ticketMedio = ticketMedio;
    }

    public long getItensVendidos() {
        return itensVendidos;
    }

    public void setItensVendidos(long itensVendidos) {
        this.itensVendidos = itensVendidos;
    }

    public List<ProdutoVendidoDTO> getMaisVendidos() {
        return maisVendidos;
    }

    public void setMaisVendidos(List<ProdutoVendidoDTO> maisVendidos) {
        this.maisVendidos = maisVendidos;
    }

    public List<ItemEstoque> getEstoqueBaixo() {
        return estoqueBaixo;
    }

    public void setEstoqueBaixo(List<ItemEstoque> estoqueBaixo) {
        this.estoqueBaixo = estoqueBaixo;
    }

    // Uma linha da tabela de estoque baixo
    public static class ItemEstoque {

        private String nome;
        private int estoque;
        private String imagem;

        public ItemEstoque(String nome, int estoque, String imagem) {
            this.nome = nome;
            this.estoque = estoque;
            this.imagem = imagem;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public int getEstoque() {
            return estoque;
        }

        public void setEstoque(int estoque) {
            this.estoque = estoque;
        }

        public String getImagem() {
            return imagem;
        }

        public void setImagem(String imagem) {
            this.imagem = imagem;
        }
    }
}
