package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.model.Categoria;
import com.ProjetoTCC.SiteVerbety.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
	
	@Autowired
	private CategoriaService categoriaService;
	
	
	//Lista todas as categoria
	@GetMapping
	public List<Categoria> listarTodos() {
		return categoriaService.listarTodos();
	}
	
	//Busca por id
	@GetMapping("/{id}")
    public ResponseEntity<Categoria> buscarPorId(@PathVariable Long id) {
        return categoriaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
	
	//Cria novas categorias
	
	@PostMapping
	public Categoria criar(@RequestBody Categoria categoria) {
		return categoriaService.salvar(categoria);
	}
	
	//Atualiza as categorias
	
	@PutMapping("/{id}")
    public ResponseEntity<Categoria> atualizar(@PathVariable Long id, @RequestBody Categoria categoria) {
        return categoriaService.buscarPorId(id)
                .map(existente -> {
                    categoria.setIdCategoria(id);
                    return ResponseEntity.ok(categoriaService.salvar(categoria));
                })
                .orElse(ResponseEntity.notFound().build());
    }
	
	//Apaga uma categoria
	
	 @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deletar(@PathVariable Long id) {
	        return categoriaService.buscarPorId(id)
	                .map(existente -> {
	                    categoriaService.deletar(id);
	                    return ResponseEntity.noContent().<Void>build();
	                })
	                .orElse(ResponseEntity.notFound().build());
	    }
	
	

}
