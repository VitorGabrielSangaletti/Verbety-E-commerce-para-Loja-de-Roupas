package com.ProjetoTCC.SiteVerbety.service;

import com.ProjetoTCC.SiteVerbety.model.ItemPedido;
import com.ProjetoTCC.SiteVerbety.repository.ItemPedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ProjetoTCC.SiteVerbety.model.Produto;
import com.ProjetoTCC.SiteVerbety.model.ProdutoTamanho;

import java.util.List;
import java.util.Optional;

@Service
public class ItemPedidoService {

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;
    @Autowired
    private ProdutoService produtoService;

    public List<ItemPedido> listarTodos() {
        return itemPedidoRepository.findAll();
    }

    public Optional<ItemPedido> buscarPorId(Long id) {
        return itemPedidoRepository.findById(id);
    }

    public ItemPedido salvar(ItemPedido itemPedido) {
        Produto produto = itemPedido.getProduto();
        String tamanho = itemPedido.getTamanho();
        Integer quantidade = itemPedido.getQuantidade();

        if (produto == null) {
            throw new RuntimeException("Produto n\u00e3o informado no item");
        }

        ProdutoTamanho prodTamanho = produto.getTamanhos().stream()
                .filter(t -> t.getTamanho().equalsIgnoreCase(tamanho))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tamanho " + tamanho + " n\u00e3o dispon\u00edvel"));

        if (prodTamanho.getQuantidade() < quantidade) {
            throw new RuntimeException("Estoque insuficiente para o tamanho " + tamanho);
        }

        prodTamanho.setQuantidade(prodTamanho.getQuantidade() - quantidade);
        produtoService.salvar(produto);

        return itemPedidoRepository.save(itemPedido);
    }

    public void deletar(Long id) {
        itemPedidoRepository.deleteById(id);
    }

    public List<ItemPedido> buscarPorPedido(Long idPedido) {
        return itemPedidoRepository.findByPedidoIdPedido(idPedido);
    }
}