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
        List<String> locais = new ArrayList<>();

        String[] candidatos = {
            "../Front end",
            "Front end",
            "C:/Users/Vitinho/Desktop/Front end"
        };

        for (String c : candidatos) {
            Path p = Paths.get(c).toAbsolutePath().normalize();
            if (Files.isDirectory(p)) {
                locais.add(p.toUri().toString());
            }
        }

        if (locais.isEmpty()) {
            locais.add(Paths.get("").toAbsolutePath().toUri().toString());
        }

        registry.addResourceHandler("/site/**")
                .addResourceLocations(locais.toArray(new String[0]));
    }
}