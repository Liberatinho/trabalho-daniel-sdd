package com.petcare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.CPF;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Hash;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "CPF é obrigatório")
    @CPF(message = "CPF deve ser válido")
    @Column(unique = true)
    private String cpf;

    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "Senha é obrigatória")
    @Hash(message = "Senha deve ser válida")
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets = new ArrayList<>();

    public User() {}

    public User(String name, String email, String cpf, String cidade, String password) {
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.cidade = cidade;
        this.password = password;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public List<Pet> getPets() { return pets; }
    public void setPets(List<Pet> pets) { this.pets = pets; }

    public void addPet(Pet pet) {
        pets.add(pet);
        pet.setUser(this);
    }

    public void removePet(Pet pet) {
        pets.remove(pet);
        pet.setUser(null);
    }
}
