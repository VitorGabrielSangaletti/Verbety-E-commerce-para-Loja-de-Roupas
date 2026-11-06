package com.ProjetoTCC.SiteVerbety.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ProjetoTCC.SiteVerbety.dto.DashboardDTO;
import com.ProjetoTCC.SiteVerbety.model.Produto;
import com.ProjetoTCC.SiteVerbety.repository.ItemPedidoRepository;
import com.ProjetoTCC.SiteVerbety.repository.PedidoRepository;
import com.ProjetoTCC.SiteVerbety.repository.ProdutoRepository;
import com.ProjetoTCC.SiteVerbety.service.ProdutoService;

// Dashboard do admin: so leitura, por isso o GET e protegido como /api/admin/**
@RestController
@RequestMapping("/api/admin/dashboard")
public class DashboardController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    @Transactional(readOnly = true)
    public DashboardDTO dashboard() {
        // Faturamento e pedidos reais (o carrinho com status ABERTO nao conta)
        BigDecimal faturamento = pedidoRepository.somarFaturamento();
        if (faturamento == null) {
            faturamento = BigDecimal.ZERO;
        }

        long totalPedidos = pedidoRepository.contarPedidos();

        Long itens = itemPedidoRepository.somarItensVendidos();
        long itensVendidos = itens == null ? 0 : itens;

        // Ticket medio = faturamento / numero de pedidos (evita dividir por zero)
        BigDecimal ticketMedio = totalPedidos == 0
                ? BigDecimal.ZERO
                : faturamento.divide(BigDecimal.valueOf(totalPedidos), 2, RoundingMode.HALF_UP);

        // Produtos com 5 ou menos unidades no total (somando todos os tamanhos)
        List<DashboardDTO.ItemEstoque> estoqueBaixo = produtoRepository.listarAtivos().stream()
                .map(p -> new DashboardDTO.ItemEstoque(p.getNome(), estoqueTotal(p), p.getImagem()))
                .filter(item -> item.getEstoque() <= 5)
                .sorted(Comparator.comparingInt(DashboardDTO.ItemEstoque::getEstoque))
                .limit(10)
                .toList();

        DashboardDTO dto = new DashboardDTO();
        dto.setFaturamentoTotal(faturamento);
        dto.setTotalPedidos(totalPedidos);
        dto.setItensVendidos(itensVendidos);
        dto.setTicketMedio(ticketMedio);
        dto.setMaisVendidos(produtoService.maisVendidos(5));
        dto.setEstoqueBaixo(estoqueBaixo);
        return dto;
    }

    // Soma a quantidade de todos os tamanhos de um produto
    private int estoqueTotal(Produto produto) {
        if (produto.getTamanhos() == null) {
            return 0;
        }
        return produto.getTamanhos().stream()
                .mapToInt(t -> t.getQuantidade() == null ? 0 : t.getQuantidade())
                .sum();
    }
}
