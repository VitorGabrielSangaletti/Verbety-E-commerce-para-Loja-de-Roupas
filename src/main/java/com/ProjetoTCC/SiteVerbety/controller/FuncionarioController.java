package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.model.Funcionario;
import com.ProjetoTCC.SiteVerbety.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    //lista tudo
    @GetMapping
    public List<Funcionario> listarTodos() {
        return funcionarioService.listarTodos();
    }

    //busco por id
    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return funcionarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //busca por email
    @GetMapping("/email/{email}")
    public ResponseEntity<Funcionario> buscarPorEmail(@PathVariable String email) {
        return funcionarioService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Cria funcionmario
    @PostMapping
    public Funcionario criar(@RequestBody Funcionario funcionario) {
        return funcionarioService.salvar(funcionario);
    }

    //atualiza funcionario
    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable Long id, @RequestBody Funcionario funcionario) {
        return funcionarioService.buscarPorId(id)
                .map(existente -> {
                    funcionario.setIdFuncionario(id);
                    return ResponseEntity.ok(funcionarioService.salvar(funcionario));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // deleta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return funcionarioService.buscarPorId(id)
                .map(existente -> {
                    funcionarioService.deletar(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}