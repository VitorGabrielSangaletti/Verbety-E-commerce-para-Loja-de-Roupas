package com.ProjetoTCC.SiteVerbety.service;

import com.ProjetoTCC.SiteVerbety.model.Produto;
import com.ProjetoTCC.SiteVerbety.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

	@Autowired
	private ProdutoRepository produtoRepository;

	public List<Produto> listarTodos() {
		return produtoRepository.findAll();
	}

	public Optional<Produto> buscarPorId(Long id) {
		return produtoRepository.findById(id);
	}

	public Produto salvar(Produto produto) {
		// liga cada tamanho ao produto dele (o JSON nao vem com essa ligacao)
		if (produto.getTamanhos() != null) {
			produto.getTamanhos().forEach(t -> t.setProduto(produto));
		}
		return produtoRepository.save(produto);
	}

	public void deletar(Long id) {
		produtoRepository.deleteById(id);
	}

	public List<Produto> buscarPorCategoria(Long idCategoria) {
		return produtoRepository.findByCategoriaIdCategoria(idCategoria);
	}

	public List<Produto> buscarDisponiveis() {
		return produtoRepository.findByDisponivel(true);
	}

	public List<Produto> buscarPorNome(String nome) {
		return produtoRepository.findByNomeContainingIgnoreCase(nome);
	}
	
	public List<Produto> buscarDestaques() {
		return produtoRepository.findByDestaqueTrue();
	}

}
