package com.ProjetoTCC.SiteVerbety.service;

import com.ProjetoTCC.SiteVerbety.model.Pedido;
import com.ProjetoTCC.SiteVerbety.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> buscarPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    public Pedido salvar(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public void deletar(Long id) {
        pedidoRepository.deleteById(id);
    }

    public List<Pedido> buscarPorUsuario(Long idUsuario) {
        return pedidoRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public List<Pedido> buscarPorStatus(String status) {
        return pedidoRepository.findByStatus(status);
    }
}