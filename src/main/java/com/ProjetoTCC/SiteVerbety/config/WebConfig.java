package com.ProjetoTCC.SiteVerbety.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String caminhoFront = "file:C:/Users/Vitinho/Desktop/OpenCode/Tcc/Front end/trabalho/";
        registry.addResourceHandler("/site/**").addResourceLocations(caminhoFront);
    }
}
