package com.petcare.controller;

import com.petcare.model.Consultation;
import com.petcare.model.ConsultationStatus;
import com.petcare.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/pets/{petId}/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PostMapping
    public ResponseEntity<Consultation> createConsultation(@PathVariable Long userId,
                                                           @PathVariable Long petId,
                                                           @Valid @RequestBody Consultation consultation) {
        Consultation created = consultationService.createConsultation(userId, petId, consultation);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultation(@PathVariable Long userId,
                                                        @PathVariable Long petId,
                                                        @PathVariable Long id) {
        Consultation consultation = consultationService.getConsultation(userId, petId, id);
        return ResponseEntity.ok(consultation);
    }

    @GetMapping
    public ResponseEntity<List<Consultation>> getConsultations(@PathVariable Long userId,
                                                              @PathVariable Long petId,
                                                              @RequestParam(required = false) ConsultationStatus status) {
        List<Consultation> consultations = consultationService.getConsultations(userId, petId, status);
        return ResponseEntity.ok(consultations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consultation> updateConsultation(@PathVariable Long userId,
                                                          @PathVariable Long petId,
                                                          @PathVariable Long id,
                                                          @Valid @RequestBody Consultation consultation) {
        Consultation updated = consultationService.updateConsultation(userId, petId, id, consultation);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long userId,
                                                   @PathVariable Long petId,
                                                   @PathVariable Long id) {
        consultationService.deleteConsultation(userId, petId, id);
        return ResponseEntity.noContent().build();
    }
}
