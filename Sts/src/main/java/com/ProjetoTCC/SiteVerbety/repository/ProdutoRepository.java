package com.ProjetoTCC.SiteVerbety.repository;

import com.ProjetoTCC.SiteVerbety.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long>{

	// Lista todos menos os excluidos
	@Query("SELECT p FROM Produto p WHERE p.excluido IS NULL OR p.excluido = false")
	List<Produto> listarAtivos();

	// Buscar produtos por categoria (ignora excluidos)
	@Query("SELECT p FROM Produto p WHERE p.categoria.idCategoria = :idCategoria "
			+ "AND (p.excluido IS NULL OR p.excluido = false)")
	List<Produto> findByCategoriaIdCategoria(@Param("idCategoria") Long idCategoria);
	
	// Buscar produtos em destaque (carrossel)
	@Query("SELECT p FROM Produto p WHERE p.destaque = true AND (p.excluido IS NULL OR p.excluido = false)")
	List<Produto> findByDestaqueTrue();
	
	// Buscar produtos em destaque da Home (vitrine da pagina inicial)
	@Query("SELECT p FROM Produto p WHERE p.destaqueHome = true AND (p.excluido IS NULL OR p.excluido = false)")
	List<Produto> findByDestaqueHomeTrue();
}
