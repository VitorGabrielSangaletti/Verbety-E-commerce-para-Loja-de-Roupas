package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.dto.AuthRequest;
import com.ProjetoTCC.SiteVerbety.model.Usuario;
import com.ProjetoTCC.SiteVerbety.model.Funcionario;
import com.ProjetoTCC.SiteVerbety.service.UsuarioService;
import com.ProjetoTCC.SiteVerbety.service.FuncionarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private FuncionarioService funcionarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    // Login do Usuario
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest, 
                                    HttpServletRequest request,
                                    HttpSession session) {
        return usuarioService.buscarPorEmail(authRequest.getEmail())
                .map(usuario -> {
                    if (passwordEncoder.matches(authRequest.getSenha(), usuario.getSenha())) {
                        session.setAttribute("usuario", usuario);
                        session.setAttribute("tipo", "USUARIO");

                        Authentication auth = new UsernamePasswordAuthenticationToken(
                                usuario.getEmail(), null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                        );
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, null);

                        Map<String, Object> response = new HashMap<>();
                        response.put("mensagem", "Login realizado com sucesso!");
                        response.put("usuario", usuario.getNome());
                        response.put("tipo", "USUARIO");
                        return (ResponseEntity<?>) ResponseEntity.ok(response);
                    } else {
                        Map<String, String> response = new HashMap<>();
                        response.put("erro", "Senha incorreta");
                        return (ResponseEntity<?>) ResponseEntity.badRequest().body(response);
                    }
                })
                .orElseGet(() -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("erro", "Usuário não encontrado");
                    return ResponseEntity.badRequest().body(response);
                });
    }

    // Login de Funcionario
    @PostMapping("/login-admin")
    public ResponseEntity<?> loginAdmin(@RequestBody AuthRequest authRequest, 
                                         HttpServletRequest request,
                                         HttpSession session) {
        return funcionarioService.buscarPorEmail(authRequest.getEmail())
                .map(funcionario -> {
                    if (passwordEncoder.matches(authRequest.getSenha(), funcionario.getSenha())) {
                        session.setAttribute("funcionario", funcionario);
                        session.setAttribute("tipo", "ADMIN");

                        Authentication auth = new UsernamePasswordAuthenticationToken(
                                funcionario.getEmail(), null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                        );
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        securityContextRepository.saveContext(SecurityContextHolder.getContext(), request, null);

                        Map<String, Object> response = new HashMap<>();
                        response.put("mensagem", "Login realizado com sucesso!");
                        response.put("funcionario", funcionario.getNome());
                        response.put("tipo", "ADMIN");
                        return (ResponseEntity<?>) ResponseEntity.ok(response);
                    } else {
                        Map<String, String> response = new HashMap<>();
                        response.put("erro", "Senha incorreta");
                        return (ResponseEntity<?>) ResponseEntity.badRequest().body(response);
                    }
                })
                .orElseGet(() -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("erro", "Funcionário não encontrado");
                    return ResponseEntity.badRequest().body(response);
                });
    }

    // Logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpSession session) {
        SecurityContextHolder.clearContext();
        request.getSession(false).invalidate();
        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Logout realizado com sucesso!");
        return ResponseEntity.ok(response);
    }

    // Cadastro do primeiro funcionario 
    @PostMapping("/cadastro-funcionario")
    public ResponseEntity<?> cadastroFuncionario(@RequestBody Funcionario funcionario) {
        if (funcionarioService.emailExiste(funcionario.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("erro", "Email já cadastrado");
            return ResponseEntity.badRequest().body(response);
        }
        funcionarioService.salvar(funcionario);
        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Funcionário cadastrado com sucesso!");
        return ResponseEntity.ok(response);
    }

    // Verifica quem ta logado
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        String tipo = (String) session.getAttribute("tipo");

        if (tipo == null) {
            Map<String, String> response = new HashMap<>();
            response.put("mensagem", "Nenhum usuário logado");
            return ResponseEntity.ok(response);
        }

        if ("ADMIN".equals(tipo)) {
            Funcionario funcionario = (Funcionario) session.getAttribute("funcionario");
            Map<String, Object> response = new HashMap<>();
            response.put("tipo", "ADMIN");
            response.put("nome", funcionario.getNome());
            response.put("email", funcionario.getEmail());
            response.put("cargo", funcionario.getCargo());
            return ResponseEntity.ok(response);
        } else {
            Usuario usuario = (Usuario) session.getAttribute("usuario");
            Map<String, Object> response = new HashMap<>();
            response.put("tipo", "USUARIO");
            response.put("nome", usuario.getNome());
            response.put("email", usuario.getEmail());
            return ResponseEntity.ok(response);
        }
    }
    
    // Cadastro de cliente (publico, sem login)
    @PostMapping("/cadastro-cliente")
    public ResponseEntity<?> cadastroCliente(@RequestBody Usuario usuario) {
        if (usuarioService.emailExiste(usuario.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("erro", "Email j\u00e1 cadastrado");
            return ResponseEntity.badRequest().body(response);
        }
        if (usuarioService.cpfExiste(usuario.getCpf())) {
            Map<String, String> response = new HashMap<>();
            response.put("erro", "CPF j\u00e1 cadastrado");
            return ResponseEntity.badRequest().body(response);
        }
        usuarioService.salvar(usuario);
        Map<String, String> response = new HashMap<>();
        response.put("mensagem", "Cadastro realizado com sucesso!");
        return ResponseEntity.ok(response);
    }
}
