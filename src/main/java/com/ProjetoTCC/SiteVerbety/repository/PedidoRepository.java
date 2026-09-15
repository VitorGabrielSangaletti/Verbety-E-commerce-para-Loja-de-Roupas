package com.ProjetoTCC.SiteVerbety.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ProjetoTCC.SiteVerbety.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Busca pedidos por usuario
    List<Pedido> findByUsuarioIdUsuario(Long idUsuario);

    // Busca pedido por status
    List<Pedido> findByStatus(String status);
    
    //Busca o carrinho aberto de um usuario
    Optional<Pedido> findByUsuarioIdUsuarioAndStatus(Long idUsuario, String status);
}