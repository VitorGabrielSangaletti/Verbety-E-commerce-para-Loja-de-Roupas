package com.ProjetoTCC.SiteVerbety.service;

import com.ProjetoTCC.SiteVerbety.model.Funcionario;
import com.ProjetoTCC.SiteVerbety.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public Optional<Funcionario> buscarPorEmail(String email) {
        return funcionarioRepository.findByEmail(email);
    }
}