package com.ProjetoTCC.SiteVerbety.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "funcionario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Funcionario {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_funcionario")
	private Long idFuncionario;
	
	@Column(name = "nome", nullable = false, length = 100)
	private String nome;
	
	@Column(name = "email", nullable = false, unique = true, length = 100)
	private String email;
	

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(name = "senha", nullable = false, length = 255)
	private String senha;
	
	@Column(name = "cargo", nullable = false, length = 50)
	private String cargo;
	
	public Long getIdFuncionario() {
        return idFuncionario;
    }

    public void setIdFuncionario(Long idFuncionario) {
        this.idFuncionario = idFuncionario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }
	

}
