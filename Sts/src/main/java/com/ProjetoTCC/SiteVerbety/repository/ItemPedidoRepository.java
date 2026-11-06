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

    // Verifica se o produto aparece em algum pedido ou carrinho
    boolean existsByProdutoIdProduto(Long idProduto);

    // Total vendido por produto: soma as quantidades dos itens, ignorando o
    // carrinho aberto (status ABERTO) e os produtos excluidos.
    // Retorna [Produto, totalVendido] em ordem decrescente.
    @Query("SELECT i.produto, SUM(i.quantidade) FROM ItemPedido i "
            + "WHERE i.pedido.status <> 'ABERTO' "
            + "AND (i.produto.excluido IS NULL OR i.produto.excluido = false) "
            + "GROUP BY i.produto ORDER BY SUM(i.quantidade) DESC")
    List<Object[]> maisVendidos();

    // Soma das quantidades vendidas (ignora o carrinho ABERTO)
    @Query("SELECT SUM(i.quantidade) FROM ItemPedido i WHERE i.pedido.status <> 'ABERTO'")
    Long somarItensVendidos();
}