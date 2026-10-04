package com.ProjetoTCC.SiteVerbety.config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // o front-end pode estar em varios lugares dependendo de como o projeto
        // foi aberto, entao tenta varios e so usa os que realmente existem:
        //  - ../Front end : rodando a API de dentro da pasta Sts
        //  - Front end    : rodando a API da raiz do repositorio
        //  - pasta de trabalho na area de trabalho
        List<String> caminhos = new ArrayList<>();

        adicionarSeExistir(caminhos, Paths.get("..", "Front end"));
        adicionarSeExistir(caminhos, Paths.get("Front end"));
        adicionarSeExistir(caminhos, Paths.get("C:/Users/Vitinho/Desktop/Front end"));

        if (caminhos.isEmpty()) {
            return;
        }

        registry.addResourceHandler("/site/**")
                .addResourceLocations(caminhos.toArray(new String[0]));
    }

    private void adicionarSeExistir(List<String> caminhos, Path pasta) {
        if (Files.isDirectory(pasta)) {
            caminhos.add("file:" + pasta.toAbsolutePath().normalize().toUri());
        }
    }
}
