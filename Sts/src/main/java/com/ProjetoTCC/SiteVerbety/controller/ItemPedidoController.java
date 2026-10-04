package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.model.ItemPedido;
import com.ProjetoTCC.SiteVerbety.service.ItemPedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itens-pedido")
public class ItemPedidoController {

    @Autowired
    private ItemPedidoService itemPedidoService;

    //lista tudo
    @GetMapping
    public List<ItemPedido> listarTodos() {
        return itemPedidoService.listarTodos();
    }

    // busca por id
    @GetMapping("/{id}")
    public ResponseEntity<ItemPedido> buscarPorId(@PathVariable Long id) {
        return itemPedidoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // busca por pedido
    @GetMapping("/pedido/{idPedido}")
    public List<ItemPedido> buscarPorPedido(@PathVariable Long idPedido) {
        return itemPedidoService.buscarPorPedido(idPedido);
    }

    // cria novo item
    @PostMapping
    public ItemPedido criar(@RequestBody ItemPedido itemPedido) {
        return itemPedidoService.salvar(itemPedido);
    }

    // atualiza item
    @PutMapping("/{id}")
    public ResponseEntity<ItemPedido> atualizar(@PathVariable Long id, @RequestBody ItemPedido itemPedido) {
        return itemPedidoService.buscarPorId(id)
                .map(existente -> {
                    itemPedido.setIdItemPedido(id);
                    return ResponseEntity.ok(itemPedidoService.salvar(itemPedido));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // deleta item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return itemPedidoService.buscarPorId(id)
                .map(existente -> {
                    itemPedidoService.deletar(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}