package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.model.Pedido;
import com.ProjetoTCC.SiteVerbety.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // Lista tudo
    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoService.listarTodos();
    }

    // Busca pro id
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable Long id) {
        return pedidoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Busca por usuario
    @GetMapping("/usuario/{idUsuario}")
    public List<Pedido> buscarPorUsuario(@PathVariable Long idUsuario) {
        return pedidoService.buscarPorUsuario(idUsuario);
    }

    // Busca por status
    @GetMapping("/status/{status}")
    public List<Pedido> buscarPorStatus(@PathVariable String status) {
        return pedidoService.buscarPorStatus(status);
    }

    // Cria novo pedido
    @PostMapping
    public Pedido criar(@RequestBody Pedido pedido) {
        return pedidoService.salvar(pedido);
    }

    // atualiza padido
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> atualizar(@PathVariable Long id, @RequestBody Pedido pedido) {
        return pedidoService.buscarPorId(id)
                .map(existente -> {
                    pedido.setIdPedido(id);
                    return ResponseEntity.ok(pedidoService.salvar(pedido));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // deleta pedido
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return pedidoService.buscarPorId(id)
                .map(existente -> {
                    pedidoService.deletar(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}