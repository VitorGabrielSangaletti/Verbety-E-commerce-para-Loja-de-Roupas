package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.dto.HomeConfigDTO;
import com.ProjetoTCC.SiteVerbety.service.HomeConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class HomeController {

    @Autowired
    private HomeConfigService homeConfigService;

    // Leitura publica: a Home usa isso pra montar banner, carrossel e cards.
    // Cai no anyRequest().permitAll() do SecurityConfig.
    @GetMapping("/api/home")
    public HomeConfigDTO obter() {
        return homeConfigService.obter();
    }

    // Escrita so do admin (o SecurityConfig ja protege /api/admin/**).
    @PutMapping("/api/admin/home")
    public HomeConfigDTO salvar(@RequestBody HomeConfigDTO dto) {
        return homeConfigService.salvar(dto);
    }
}
