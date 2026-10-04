package com.ProjetoTCC.SiteVerbety.repository;

import com.ProjetoTCC.SiteVerbety.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	
	//busca por email
	Optional<Usuario> findByEmail(String email);
	
	//Verifica se ja tem esse email
	boolean existsByEmail(String email);
	
	//Verifica se o cpf ja existe
	boolean existsByCpf(String cpf);

	

}
