package com.ProjetoTCC.SiteVerbety.repository;

import com.ProjetoTCC.SiteVerbety.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Busca pedidos por usuario
    List<Pedido> findByUsuarioIdUsuario(Long idUsuario);

    // Busca pedido por status
    List<Pedido> findByStatus(String status);
}