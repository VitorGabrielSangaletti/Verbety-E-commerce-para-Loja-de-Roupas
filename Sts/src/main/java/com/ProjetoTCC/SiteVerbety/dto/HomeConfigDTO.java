package com.ProjetoTCC.SiteVerbety.dto;

import java.util.ArrayList;
import java.util.List;

// Formato que trafega entre o back e o front (GET /api/home e PUT /api/admin/home).
// O carrossel e uma lista de nomes de imagem, e os cards vem em lista tambem,
// pra Home e a tela do admin nao precisarem saber como tudo isso e guardado.
public class HomeConfigDTO {

    private String bannerImagem;
    private String bannerTexto;
    private List<String> carrossel = new ArrayList<>();
    private List<CardDTO> cards = new ArrayList<>();

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

    public List<String> getCarrossel() {
        return carrossel;
    }

    public void setCarrossel(List<String> carrossel) {
        this.carrossel = carrossel;
    }

    public List<CardDTO> getCards() {
        return cards;
    }

    public void setCards(List<CardDTO> cards) {
        this.cards = cards;
    }

    public static class CardDTO {
        private String imagem;
        private String titulo;
        private String texto;

        public CardDTO() {
        }

        public CardDTO(String imagem, String titulo, String texto) {
            this.imagem = imagem;
            this.titulo = titulo;
            this.texto = texto;
        }

        public String getImagem() {
            return imagem;
        }

        public void setImagem(String imagem) {
            this.imagem = imagem;
        }

        public String getTitulo() {
            return titulo;
        }

        public void setTitulo(String titulo) {
            this.titulo = titulo;
        }

        public String getTexto() {
            return texto;
        }

        public void setTexto(String texto) {
            this.texto = texto;
        }
    }
}
