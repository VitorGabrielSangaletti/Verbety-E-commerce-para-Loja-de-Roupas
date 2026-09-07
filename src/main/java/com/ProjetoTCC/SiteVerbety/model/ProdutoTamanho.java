package com.ProjetoTCC.SiteVerbety.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "produto_tamanho")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProdutoTamanho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_produto_tamanho")
    private Long idProdutoTamanho;

    @ManyToOne
    @JoinColumn(name = "id_produto", nullable = false)
    @JsonIgnore
    private Produto produto;

    @Column(name = "tamanho", nullable = false, length = 10)
    private String tamanho;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    public Long getIdProdutoTamanho() {
        return idProdutoTamanho;
    }

    public void setIdProdutoTamanho(Long idProdutoTamanho) {
        this.idProdutoTamanho = idProdutoTamanho;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public String getTamanho() {
        return tamanho;
    }

    public void setTamanho(String tamanho) {
        this.tamanho = tamanho;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}