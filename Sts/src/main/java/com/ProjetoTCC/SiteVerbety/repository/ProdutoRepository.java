package com.ProjetoTCC.SiteVerbety.repository;

import com.ProjetoTCC.SiteVerbety.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long>{

	// Buscar produtos por categoria
	List<Produto> findByCategoriaIdCategoria(Long idCategoria);
	
	// Buscar produtos disponíveis
	List<Produto> findByDisponivel(Boolean disponivel);
	
	// Buscar produtos por nome
	List<Produto> findByNomeContainingIgnoreCase(String nome);
	
	// Buscar produtos em destaque (carrossel)
	List<Produto> findByDestaqueTrue();
}
