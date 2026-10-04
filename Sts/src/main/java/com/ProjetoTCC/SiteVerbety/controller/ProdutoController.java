package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.model.Produto;
import com.ProjetoTCC.SiteVerbety.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    //lista tudo
    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    //busca por id
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //busca por categoria
    @GetMapping("/categoria/{idCategoria}")
    public List<Produto> buscarPorCategoria(@PathVariable Long idCategoria) {
        return produtoService.buscarPorCategoria(idCategoria);
    }

    //busca por produtos disponiveis
    @GetMapping("/disponiveis")
    public List<Produto> buscarDisponiveis() {
        return produtoService.buscarDisponiveis();
    }
    
    // busca produtos em destaque (carrossel)
    @GetMapping("/destaques")
    public List<Produto> buscarDestaques() {
        return produtoService.buscarDestaques();
    }

    //busca por nome
    @GetMapping("/buscar")
    public List<Produto> buscarPorNome(@RequestParam String nome) {
        return produtoService.buscarPorNome(nome);
    }

    //cria novo produto
    @PostMapping
    public Produto criar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }

    //atualiza produto
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto produto) {
        return produtoService.buscarPorId(id)
                .map(existente -> {
                    produto.setIdProduto(id);
                    return ResponseEntity.ok(produtoService.salvar(produto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //deleta produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return produtoService.buscarPorId(id)
                .map(existente -> {
                    produtoService.deletar(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}