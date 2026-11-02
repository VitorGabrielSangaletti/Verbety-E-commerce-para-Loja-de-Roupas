package com.ProjetoTCC.SiteVerbety.config;

import com.ProjetoTCC.SiteVerbety.service.UsuarioDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final UsuarioDetailsService usuarioDetailsService;

	public SecurityConfig(UsuarioDetailsService usuarioDetailsService) {
		this.usuarioDetailsService = usuarioDetailsService;
	}

	@Bean
	public SecurityContextRepository securityContextRepository() {
		return new HttpSessionSecurityContextRepository();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(Customizer.withDefaults())
				.securityContext(ctx -> ctx.securityContextRepository(securityContextRepository()))
				.authorizeHttpRequests(auth -> auth
						// Parte publica: so leitura (GET) de produtos e categorias
						.requestMatchers(HttpMethod.GET, "/api/categorias", "/api/categorias/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/produtos", "/api/produtos/**").permitAll()
						// Cadastro de funcionario so pode ser feito por um admin ja logado.
						.requestMatchers("/api/auth/cadastro-funcionario").hasRole("ADMIN")
						.requestMatchers("/api/auth/**").permitAll()

						// Parte que o usuario tem que logar
						.requestMatchers("/api/pedidos/**").authenticated().requestMatchers("/api/itens-pedido/**")
						.authenticated().requestMatchers("/api/carrinho/**").authenticated()

						// Parte que so funcionario pode mexer (admin)
						.requestMatchers(HttpMethod.POST, "/api/categorias/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.POST, "/api/produtos/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole("ADMIN")
						.requestMatchers("/api/usuarios/**").hasRole("ADMIN").requestMatchers("/api/funcionarios/**")
						.hasRole("ADMIN").requestMatchers("/api/admin/**").hasRole("ADMIN")

						.anyRequest().permitAll())

				.userDetailsService(usuarioDetailsService).formLogin(form -> form.disable())
				.httpBasic(basic -> basic.disable());
		return http.build();
	}
}
