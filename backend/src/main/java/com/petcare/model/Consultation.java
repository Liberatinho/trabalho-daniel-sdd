package com.petcare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Data da consulta é obrigatória")
    private LocalDateTime date;

    @NotBlank(message = "Veterinário é obrigatório")
    private String veterinarian;

    @NotBlank(message = "Motivo é obrigatório")
    private String reason;

    @Column(length = 1000)
    private String notes;

    @NotNull(message = "Status é obrigatório")
    @Enumerated(EnumType.STRING)
    private ConsultationStatus status = ConsultationStatus.SCHEDULED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonIgnore
    private Pet pet;

    public Consultation() {}

    public Consultation(LocalDateTime date, String veterinarian, String reason, Pet pet) {
        this.date = date;
        this.veterinarian = veterinarian;
        this.reason = reason;
        this.pet = pet;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getVeterinarian() { return veterinarian; }
    public void setVeterinarian(String veterinarian) { this.veterinarian = veterinarian; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public ConsultationStatus getStatus() { return status; }
    public void setStatus(ConsultationStatus status) { this.status = status; }

    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }
}
