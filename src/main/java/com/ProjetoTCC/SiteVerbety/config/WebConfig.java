package com.ProjetoTCC.SiteVerbety.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // tenta primeiro o Front end dentro da pasta do projeto (funciona em qualquer PC,
        // ex: abrir a pasta do TCC no STS do colégio) e so depois o caminho fixo do pc
        String caminhoFrontNoProjeto = "file:"
                + java.nio.file.Paths.get("Front end").toAbsolutePath().toUri().toString();
        String caminhoFrontDesktop = "file:C:/Users/Vitinho/Desktop/OpenCode/Tcc/Front end/";
        registry.addResourceHandler("/site/**").addResourceLocations(caminhoFrontNoProjeto, caminhoFrontDesktop);
    }
}
