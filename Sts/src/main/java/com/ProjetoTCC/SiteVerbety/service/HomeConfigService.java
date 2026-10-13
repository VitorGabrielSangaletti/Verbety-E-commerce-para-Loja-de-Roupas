package com.ProjetoTCC.SiteVerbety.service;

import com.ProjetoTCC.SiteVerbety.dto.HomeConfigDTO;
import com.ProjetoTCC.SiteVerbety.model.HomeConfig;
import com.ProjetoTCC.SiteVerbety.repository.HomeConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HomeConfigService {

    @Autowired
    private HomeConfigRepository homeConfigRepository;

    // a configuracao da Home e sempre a mesma linha (id = 1)
    private static final Long ID = 1L;

    // devolve a configuracao; se ainda nao existir, cria com os valores
    // que a Home ja usava (assim nada muda ate o admin editar)
    public HomeConfig obterEntidade() {
        return homeConfigRepository.findById(ID).orElseGet(this::criarPadrao);
    }

    private HomeConfig criarPadrao() {
        HomeConfig c = new HomeConfig();
        c.setIdConfig(ID);
        c.setBannerImagem("BannerPrimavera.png");
        c.setBannerTexto("DESCONTO DE PRIMAVERA");

        c.setCard1Imagem("VestidoCasualLinho.png");
        c.setCard1Titulo("VESTIDOS");
        c.setCard1Texto("EXPLORE NOVAS TENDÊNCIAS");

        c.setCard2Imagem("VestidoMidi.png");
        c.setCard2Titulo("MASCULINO");
        c.setCard2Texto("ROUPAS PARA CADA TIPO");

        c.setCard3Imagem("VestidoCurtoVerao.png");
        c.setCard3Titulo("FEMININO");
        c.setCard3Texto("AS MELHORES ESCOLHAS SE ENCONTRAM AQUI");

        c.setCarrossel("banabana.jpeg\nilicito.png\nDocthos.jpeg");
        return homeConfigRepository.save(c);
    }

    public HomeConfigDTO obter() {
        return paraDTO(obterEntidade());
    }

    // salva o que veio do painel do admin e devolve o resultado
    public HomeConfigDTO salvar(HomeConfigDTO dto) {
        HomeConfig c = homeConfigRepository.findById(ID).orElseGet(HomeConfig::new);
        c.setIdConfig(ID);
        c.setBannerImagem(dto.getBannerImagem());
        c.setBannerTexto(dto.getBannerTexto());

        List<HomeConfigDTO.CardDTO> cards = dto.getCards() != null
                ? dto.getCards()
                : new ArrayList<>();

        c.setCard1Imagem(imagem(cards, 0));
        c.setCard1Titulo(titulo(cards, 0));
        c.setCard1Texto(texto(cards, 0));

        c.setCard2Imagem(imagem(cards, 1));
        c.setCard2Titulo(titulo(cards, 1));
        c.setCard2Texto(texto(cards, 1));

        c.setCard3Imagem(imagem(cards, 2));
        c.setCard3Titulo(titulo(cards, 2));
        c.setCard3Texto(texto(cards, 2));

        c.setCarrossel(juntarCarrossel(dto.getCarrossel()));

        return paraDTO(homeConfigRepository.save(c));
    }

    // ---------- de/para ----------

    private HomeConfigDTO paraDTO(HomeConfig c) {
        HomeConfigDTO dto = new HomeConfigDTO();
        dto.setBannerImagem(c.getBannerImagem());
        dto.setBannerTexto(c.getBannerTexto());
        dto.setCarrossel(separarCarrossel(c.getCarrossel()));

        List<HomeConfigDTO.CardDTO> cards = new ArrayList<>();
        cards.add(new HomeConfigDTO.CardDTO(c.getCard1Imagem(), c.getCard1Titulo(), c.getCard1Texto()));
        cards.add(new HomeConfigDTO.CardDTO(c.getCard2Imagem(), c.getCard2Titulo(), c.getCard2Texto()));
        cards.add(new HomeConfigDTO.CardDTO(c.getCard3Imagem(), c.getCard3Titulo(), c.getCard3Texto()));
        dto.setCards(cards);
        return dto;
    }

    private List<String> separarCarrossel(String texto) {
        List<String> lista = new ArrayList<>();
        if (texto == null || texto.isBlank()) {
            return lista;
        }
        for (String linha : texto.split("\\r?\\n")) {
            if (!linha.isBlank()) {
                lista.add(linha.trim());
            }
        }
        return lista;
    }

    private String juntarCarrossel(List<String> lista) {
        if (lista == null) {
            return null;
        }
        List<String> limpas = new ArrayList<>();
        for (String item : lista) {
            if (item != null && !item.isBlank()) {
                limpas.add(item.trim());
            }
        }
        return String.join("\n", limpas);
    }

    private String imagem(List<HomeConfigDTO.CardDTO> cards, int i) {
        return i < cards.size() && cards.get(i) != null ? cards.get(i).getImagem() : null;
    }

    private String titulo(List<HomeConfigDTO.CardDTO> cards, int i) {
        return i < cards.size() && cards.get(i) != null ? cards.get(i).getTitulo() : null;
    }

    private String texto(List<HomeConfigDTO.CardDTO> cards, int i) {
        return i < cards.size() && cards.get(i) != null ? cards.get(i).getTexto() : null;
    }
}
