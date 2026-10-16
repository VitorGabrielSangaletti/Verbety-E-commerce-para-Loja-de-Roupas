package com.ProjetoTCC.SiteVerbety.repository;

import com.ProjetoTCC.SiteVerbety.model.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {

    // Buscar itens de um pedido
    List<ItemPedido> findByPedidoIdPedido(Long idPedido);

    // Total vendido por produto: soma as quantidades dos itens, ignorando o
    // carrinho aberto (status ABERTO). Retorna [Produto, totalVendido] em ordem decrescente.
    @Query("SELECT i.produto, SUM(i.quantidade) FROM ItemPedido i "
            + "WHERE i.pedido.status <> 'ABERTO' "
            + "GROUP BY i.produto ORDER BY SUM(i.quantidade) DESC")
    List<Object[]> maisVendidos();
}