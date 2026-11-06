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
	
	//Cria novas categorias
	
	@PostMapping
	public Categoria criar(@RequestBody Categoria categoria) {
		return categoriaService.salvar(categoria);
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
