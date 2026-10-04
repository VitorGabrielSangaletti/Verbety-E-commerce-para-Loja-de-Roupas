package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.model.Usuario;
import com.ProjetoTCC.SiteVerbety.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	// lista tudo
	@GetMapping
	public List<Usuario> listarTodos() {
		return usuarioService.listarTodos();
	}

	// Busca por id
	@GetMapping("/{id}")
	public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
		return usuarioService.buscarPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	// busca por email
	@GetMapping("/email/{email}")
	public ResponseEntity<Usuario> buscarPorEmail(@PathVariable String email) {
		return usuarioService.buscarPorEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	// Cria novo usuario
	@PostMapping
	public Usuario criar(@RequestBody Usuario usuario) {
		return usuarioService.salvar(usuario);
	}

	// atualioza usuario
	@PutMapping("/{id}")
	public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
		return usuarioService.buscarPorId(id).map(existente -> {
			usuario.setIdUsuario(id);
			return ResponseEntity.ok(usuarioService.salvar(usuario));
		}).orElse(ResponseEntity.notFound().build());
	}

	// Deleta
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id) {
		return usuarioService.buscarPorId(id).map(existente -> {
			usuarioService.deletar(id);
			return ResponseEntity.noContent().<Void>build();
		}).orElse(ResponseEntity.notFound().build());
	}

}
