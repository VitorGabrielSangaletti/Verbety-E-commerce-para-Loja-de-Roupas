package com.ProjetoTCC.SiteVerbety.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "produto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Produto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_produto")
	private Long idProduto;

	@ManyToOne
	@JoinColumn(name = "id_categoria", nullable = false)
	private Categoria categoria;

	@Column(name = "nome", nullable = false, length = 100)
	private String nome;

	@Column(name = "descricao", columnDefinition = "TEXT")
	private String descricao;

	@Column(name = "preco", nullable = false)
	private Double preco;

	@Column(name = "imagem", nullable = false, length = 255)
	private String imagem;

	// Segunda imagem, usada na troca ao passar o mouse no card (hover)
	@Column(name = "imagem2", length = 255)
	private String imagem2;

	@Column(name = "disponivel")
	private Boolean disponivel;
	
    @Column(name = "destaque")
    private Boolean destaque;

    // Aparece na vitrine de destaques da Home (separado do destaque da pagina)
    @Column(name = "destaque_home")
    private Boolean destaqueHome;

    // Genero do produto: MASCULINO, FEMININO, ACESSORIO ou UNISSEX
    @Column(name = "genero", length = 20)
    private String genero;

    // Produto excluido some da loja, mas continua no historico de pedidos
    @Column(name = "excluido")
    private Boolean excluido = false;

    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("produto")
    private List<ProdutoTamanho> tamanhos = new ArrayList<>();

	public Long getIdProduto() {
		return idProduto;
	}

	public void setIdProduto(Long idProduto) {
		this.idProduto = idProduto;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public Double getPreco() {
		return preco;
	}

	public void setPreco(Double preco) {
		this.preco = preco;
	}

	public String getImagem() {
		return imagem;
	}

	public void setImagem(String imagem) {
		this.imagem = imagem;
	}

	public String getImagem2() {
		return imagem2;
	}

	public void setImagem2(String imagem2) {
		this.imagem2 = imagem2;
	}

	public Boolean getDisponivel() {
		return disponivel;
	}

	public void setDisponivel(Boolean disponivel) {
		this.disponivel = disponivel;
	}
	
    public Boolean getDestaque() {
        return destaque;
    }

    public void setDestaque(Boolean destaque) {
        this.destaque = destaque;
    }

    public Boolean getDestaqueHome() {
        return destaqueHome;
    }

    public void setDestaqueHome(Boolean destaqueHome) {
        this.destaqueHome = destaqueHome;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public Boolean getExcluido() {
        return excluido;
    }

    public void setExcluido(Boolean excluido) {
        this.excluido = excluido;
    }

    public List<ProdutoTamanho> getTamanhos() {
        return tamanhos;
    }

    public void setTamanhos(List<ProdutoTamanho> tamanhos) {
        this.tamanhos = tamanhos;
    }

}
