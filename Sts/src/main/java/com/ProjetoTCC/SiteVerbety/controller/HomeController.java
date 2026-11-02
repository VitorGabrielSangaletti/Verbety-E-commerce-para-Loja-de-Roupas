package com.ProjetoTCC.SiteVerbety.controller;

import com.ProjetoTCC.SiteVerbety.dto.HomeConfigDTO;
import com.ProjetoTCC.SiteVerbety.service.HomeConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class HomeController {

    @Autowired
    private HomeConfigService homeConfigService;

    // usado na Home pra montar banner, carrossel e cards.
    
    @GetMapping("/api/home")
    public HomeConfigDTO obter() {
        return homeConfigService.obter();
    }

    // Escrita so do admin 
    @PutMapping("/api/admin/home")
    public HomeConfigDTO salvar(@RequestBody HomeConfigDTO dto) {
        return homeConfigService.salvar(dto);
    }
}
