package com.ProjetoTCC.SiteVerbety.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// Configuracao editavel da Home.
// Tabela de linha unica (id_config = 1): guarda o banner, os 3 cards de
// categoria e as imagens do carrossel. O service cria a linha padrao na
// primeira leitura, entao a Home nunca fica sem dados.
@Entity
@Table(name = "home_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class HomeConfig {

    @Id
    @Column(name = "id_config")
    private Long idConfig;

    // Banner ("DESCONTO DE PRIMAVERA")
    @Column(name = "banner_imagem", length = 255)
    private String bannerImagem;

    @Column(name = "banner_texto", length = 255)
    private String bannerTexto;

    // Card 1
    @Column(name = "card1_imagem", length = 255)
    private String card1Imagem;
    @Column(name = "card1_titulo", length = 255)
    private String card1Titulo;
    @Column(name = "card1_texto", length = 255)
    private String card1Texto;

    // Card 2
    @Column(name = "card2_imagem", length = 255)
    private String card2Imagem;
    @Column(name = "card2_titulo", length = 255)
    private String card2Titulo;
    @Column(name = "card2_texto", length = 255)
    private String card2Texto;

    // Card 3
    @Column(name = "card3_imagem", length = 255)
    private String card3Imagem;
    @Column(name = "card3_titulo", length = 255)
    private String card3Titulo;
    @Column(name = "card3_texto", length = 255)
    private String card3Texto;

    // Nomes das imagens do carrossel, uma por linha
    @Column(name = "carrossel", columnDefinition = "TEXT")
    private String carrossel;

    public Long getIdConfig() {
        return idConfig;
    }

    public void setIdConfig(Long idConfig) {
        this.idConfig = idConfig;
    }
}
