package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.model.ItemPedido;
import com.ProjetoTCC.SiteVerbety.model.Pedido;
import com.ProjetoTCC.SiteVerbety.model.Usuario;
import com.ProjetoTCC.SiteVerbety.service.CarrinhoService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carrinho")
public class CarrinhoController {

    @Autowired
    private CarrinhoService carrinhoService;

    // monta a lista de produtos 
    private Map<String, Object> resposta(Pedido carrinho) {
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("idPedido", carrinho.getIdPedido());
        resposta.put("status", carrinho.getStatus());
        resposta.put("valorTotal", carrinho.getValorTotal());
        resposta.put("itens", carrinhoService.itensDoPedido(carrinho.getIdPedido()).stream()
                .map(this::itemResposta)
                .toList());
        return resposta;
    }

    private Map<String, Object> itemResposta(ItemPedido item) {
        Map<String, Object> m = new HashMap<>();
        m.put("idItemPedido", item.getIdItemPedido());
        m.put("tamanho", item.getTamanho());
        m.put("quantidade", item.getQuantidade());
        m.put("precoUnidade", item.getPrecoUnidade());
        m.put("subtotal", item.getSubtotal());
        m.put("produto", item.getProduto());
        return m;
    }

    // verifica se ta logado
    private Usuario usuarioLogado(HttpSession session) {
        if (!"USUARIO".equals(session.getAttribute("tipo"))) {
            return null;
        }
        return (Usuario) session.getAttribute("usuario");
    }

  //CRUD
    @GetMapping
    public ResponseEntity<?> verCarrinho(HttpSession session) {
        Usuario usuario = usuarioLogado(session);
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("erro", "Fa\u00e7a login para ver o carrinho"));
        }
        return carrinhoService.buscarCarrinho(usuario)
                .map(c -> ResponseEntity.ok((Object) resposta(c)))
                .orElseGet(() -> {
                    Map<String, Object> vazio = new HashMap<>();
                    vazio.put("status", "ABERTO");
                    vazio.put("valorTotal", 0);
                    vazio.put("itens", List.of());
                    return ResponseEntity.ok(vazio);
                });
    }

    @PostMapping("/itens")
    public ResponseEntity<?> adicionar(@RequestBody Map<String, Object> body, HttpSession session) {
        Usuario usuario = usuarioLogado(session);
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("erro", "Fa\u00e7a login para adicionar ao carrinho"));
        }
        try {
            Long idProduto = Long.valueOf(body.get("idProduto").toString());
            String tamanho = body.get("tamanho").toString();
            Integer quantidade = body.get("quantidade") != null
                    ? Integer.valueOf(body.get("quantidade").toString()) : 1;
            Pedido carrinho = carrinhoService.adicionarItem(usuario, idProduto, tamanho, quantidade);
            return ResponseEntity.ok(resposta(carrinho));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/itens/{id}/quantidade")
    public ResponseEntity<?> atualizarQuantidade(@PathVariable Long id,
                                                 @RequestBody Map<String, Object> body,
                                                 HttpSession session) {
        Usuario usuario = usuarioLogado(session);
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("erro", "Fa\u00e7a login"));
        }
        try {
            Integer quantidade = Integer.valueOf(body.get("quantidade").toString());
            Pedido carrinho = carrinhoService.atualizarQuantidade(usuario, id, quantidade);
            return ResponseEntity.ok(resposta(carrinho));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @DeleteMapping("/itens/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id, HttpSession session) {
        Usuario usuario = usuarioLogado(session);
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("erro", "Fa\u00e7a login"));
        }
        try {
            Pedido carrinho = carrinhoService.removerItem(usuario, id);
            return ResponseEntity.ok(resposta(carrinho));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/finalizar")
    public ResponseEntity<?> finalizar(@RequestBody(required = false) Map<String, Object> body, HttpSession session) {
        Usuario usuario = usuarioLogado(session);
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("erro", "Fa\u00e7a login para finalizar"));
        }
        String formaPagamento = body != null && body.get("formaPagamento") != null
                ? body.get("formaPagamento").toString() : null;
        String observacao = body != null && body.get("observacao") != null
                ? body.get("observacao").toString() : null;
        try {
            Pedido carrinho = carrinhoService.finalizar(usuario, formaPagamento, observacao);
            return ResponseEntity.ok(resposta(carrinho));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}