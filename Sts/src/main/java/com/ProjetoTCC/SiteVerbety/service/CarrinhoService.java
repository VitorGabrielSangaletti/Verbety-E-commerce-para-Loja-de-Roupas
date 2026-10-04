package com.ProjetoTCC.SiteVerbety.service;

import com.ProjetoTCC.SiteVerbety.model.ItemPedido;
import com.ProjetoTCC.SiteVerbety.model.Pedido;
import com.ProjetoTCC.SiteVerbety.model.Produto;
import com.ProjetoTCC.SiteVerbety.model.ProdutoTamanho;
import com.ProjetoTCC.SiteVerbety.model.Usuario;
import com.ProjetoTCC.SiteVerbety.repository.ItemPedidoRepository;
import com.ProjetoTCC.SiteVerbety.repository.PedidoRepository;
import com.ProjetoTCC.SiteVerbety.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CarrinhoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    private static final String STATUS_ABERTO = "ABERTO";

    // so consulta, nao cria nada
    public Optional<Pedido> buscarCarrinho(Usuario usuario) {
        return pedidoRepository.findByUsuarioIdUsuarioAndStatus(usuario.getIdUsuario(), STATUS_ABERTO);
    }

    // pega o carrinho ou cria um novo, usado quando vai mudar alguma coisa tipo editar ou excluir um produto
    public Pedido buscarOuCriarCarrinho(Usuario usuario) {
        return buscarCarrinho(usuario).orElseGet(() -> {
            Pedido pedido = new Pedido();
            pedido.setUsuario(usuario);
            pedido.setDataPedido(LocalDateTime.now());
            pedido.setStatus(STATUS_ABERTO);
            pedido.setValorTotal(BigDecimal.ZERO);
            return pedidoRepository.save(pedido);
        });
    }

    public List<ItemPedido> itensDoPedido(Long idPedido) {
        return itemPedidoRepository.findByPedidoIdPedido(idPedido);
    }

    // adiciona um item 
    public Pedido adicionarItem(Usuario usuario, Long idProduto, String tamanho, Integer quantidade) {
        if (quantidade == null || quantidade < 1) {
            throw new RuntimeException("Quantidade inv\u00e1lida");
        }

        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new RuntimeException("Produto n\u00e3o encontrado"));

        ProdutoTamanho prodTamanho = produto.getTamanhos().stream()
                .filter(t -> t.getTamanho().equalsIgnoreCase(tamanho))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tamanho " + tamanho + " n\u00e3o dispon\u00edvel"));

        Pedido carrinho = buscarOuCriarCarrinho(usuario);

        // se ja tiver o produto no carrinho entao soma a quantidade
        ItemPedido item = itensDoPedido(carrinho.getIdPedido()).stream()
                .filter(i -> i.getProduto().getIdProduto().equals(idProduto)
                        && tamanho.equalsIgnoreCase(i.getTamanho()))
                .findFirst()
                .orElse(null);

        int jaNoCarrinho = item != null ? item.getQuantidade() : 0;
        if (prodTamanho.getQuantidade() < jaNoCarrinho + quantidade) {
            throw new RuntimeException("Estoque insuficiente para o tamanho " + tamanho);
        }

        if (item == null) {
            item = new ItemPedido();
            item.setPedido(carrinho);
            item.setProduto(produto);
            item.setTamanho(tamanho.toUpperCase());
            item.setQuantidade(quantidade);
            item.setPrecoUnidade(BigDecimal.valueOf(produto.getPreco()));
        } else {
            item.setQuantidade(jaNoCarrinho + quantidade);
        }

        item.setSubtotal(item.getPrecoUnidade().multiply(BigDecimal.valueOf(item.getQuantidade())));
        itemPedidoRepository.save(item);

        recalcularTotal(carrinho.getIdPedido());
        return carrinho;
    }

    // muda a quantidade de um item do carrinho
    public Pedido atualizarQuantidade(Usuario usuario, Long idItemPedido, Integer quantidade) {
        if (quantidade == null || quantidade < 1) {
            throw new RuntimeException("Quantidade inv\u00e1lida");
        }

        Pedido carrinho = buscarOuCriarCarrinho(usuario);

        ItemPedido item = itemPedidoRepository.findById(idItemPedido)
                .filter(i -> i.getPedido().getIdPedido().equals(carrinho.getIdPedido()))
                .orElseThrow(() -> new RuntimeException("Item n\u00e3o encontrado no carrinho"));

        ProdutoTamanho prodTamanho = item.getProduto().getTamanhos().stream()
                .filter(t -> t.getTamanho().equalsIgnoreCase(item.getTamanho()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tamanho n\u00e3o dispon\u00edvel"));

        if (prodTamanho.getQuantidade() < quantidade) {
            throw new RuntimeException("Estoque insuficiente para o tamanho " + item.getTamanho());
        }

        item.setQuantidade(quantidade);
        item.setSubtotal(item.getPrecoUnidade().multiply(BigDecimal.valueOf(quantidade)));
        itemPedidoRepository.save(item);

        recalcularTotal(carrinho.getIdPedido());
        return carrinho;
    }

    // remove um item do carrinho
    public Pedido removerItem(Usuario usuario, Long idItemPedido) {
        Pedido carrinho = buscarOuCriarCarrinho(usuario);

        ItemPedido item = itemPedidoRepository.findById(idItemPedido)
                .filter(i -> i.getPedido().getIdPedido().equals(carrinho.getIdPedido()))
                .orElseThrow(() -> new RuntimeException("Item n\u00e3o encontrado no carrinho"));

        itemPedidoRepository.delete(item);
        recalcularTotal(carrinho.getIdPedido());
        return carrinho;
    }

    // finaliza a compra, confere o estoque de novo, debita e fecha o pedido
    public Pedido finalizar(Usuario usuario, String formaPagamento, String observacao) {
        Pedido carrinho = buscarOuCriarCarrinho(usuario);
        List<ItemPedido> itens = itensDoPedido(carrinho.getIdPedido());

        if (itens.isEmpty()) {
            throw new RuntimeException("Carrinho vazio");
        }

        // confere o estoque antes de debitar
        for (ItemPedido item : itens) {
            ProdutoTamanho prodTamanho = item.getProduto().getTamanhos().stream()
                    .filter(t -> t.getTamanho().equalsIgnoreCase(item.getTamanho()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException(
                            "Tamanho " + item.getTamanho() + " de " + item.getProduto().getNome()
                                    + " n\u00e3o dispon\u00edvel"));

            if (prodTamanho.getQuantidade() < item.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente de " + item.getProduto().getNome()
                        + " no tamanho " + item.getTamanho() + " \u2014 pedido n\u00e3o conclu\u00eddo");
            }
        }

        // debita de verdade
        for (ItemPedido item : itens) {
            ProdutoTamanho prodTamanho = item.getProduto().getTamanhos().stream()
                    .filter(t -> t.getTamanho().equalsIgnoreCase(item.getTamanho()))
                    .findFirst()
                    .orElseThrow();

            prodTamanho.setQuantidade(prodTamanho.getQuantidade() - item.getQuantidade());
            produtoRepository.save(item.getProduto());
        }

        carrinho.setStatus("RECEBIDO");
        carrinho.setFormaPagamento(formaPagamento);
        carrinho.setObservacao(observacao);
        return pedidoRepository.save(carrinho);
    }

    private void recalcularTotal(Long idPedido) {
        Pedido carrinho = pedidoRepository.findById(idPedido).orElseThrow();
        BigDecimal total = itensDoPedido(idPedido).stream()
                .map(ItemPedido::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        carrinho.setValorTotal(total);
        pedidoRepository.save(carrinho);
    }
}