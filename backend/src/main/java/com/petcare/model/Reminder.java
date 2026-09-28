package com.petcare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "reminders")
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Tipo do lembrete é obrigatório")
    @Enumerated(EnumType.STRING)
    private ReminderType type;

    @NotBlank(message = "Descrição é obrigatória")
    private String description;

    @NotNull(message = "Data de vencimento é obrigatória")
    private LocalDate dueDate;

    @Column(nullable = false)
    private Boolean completed = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonIgnore
    private Pet pet;

    public Reminder() {}

    public Reminder(ReminderType type, String description, LocalDate dueDate, Pet pet) {
        this.type = type;
        this.description = description;
        this.dueDate = dueDate;
        this.pet = pet;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReminderType getType() { return type; }
    public void setType(ReminderType type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }
}
