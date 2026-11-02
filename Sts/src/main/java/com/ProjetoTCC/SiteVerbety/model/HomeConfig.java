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

    public String getBannerImagem() {
        return bannerImagem;
    }

    public void setBannerImagem(String bannerImagem) {
        this.bannerImagem = bannerImagem;
    }

    public String getBannerTexto() {
        return bannerTexto;
    }

    public void setBannerTexto(String bannerTexto) {
        this.bannerTexto = bannerTexto;
    }

    public String getCard1Imagem() {
        return card1Imagem;
    }

    public void setCard1Imagem(String card1Imagem) {
        this.card1Imagem = card1Imagem;
    }

    public String getCard1Titulo() {
        return card1Titulo;
    }

    public void setCard1Titulo(String card1Titulo) {
        this.card1Titulo = card1Titulo;
    }

    public String getCard1Texto() {
        return card1Texto;
    }

    public void setCard1Texto(String card1Texto) {
        this.card1Texto = card1Texto;
    }

    public String getCard2Imagem() {
        return card2Imagem;
    }

    public void setCard2Imagem(String card2Imagem) {
        this.card2Imagem = card2Imagem;
    }

    public String getCard2Titulo() {
        return card2Titulo;
    }

    public void setCard2Titulo(String card2Titulo) {
        this.card2Titulo = card2Titulo;
    }

    public String getCard2Texto() {
        return card2Texto;
    }

    public void setCard2Texto(String card2Texto) {
        this.card2Texto = card2Texto;
    }

    public String getCard3Imagem() {
        return card3Imagem;
    }

    public void setCard3Imagem(String card3Imagem) {
        this.card3Imagem = card3Imagem;
    }

    public String getCard3Titulo() {
        return card3Titulo;
    }

    public void setCard3Titulo(String card3Titulo) {
        this.card3Titulo = card3Titulo;
    }

    public String getCard3Texto() {
        return card3Texto;
    }

    public void setCard3Texto(String card3Texto) {
        this.card3Texto = card3Texto;
    }

    public String getCarrossel() {
        return carrossel;
    }

    public void setCarrossel(String carrossel) {
        this.carrossel = carrossel;
    }
}
