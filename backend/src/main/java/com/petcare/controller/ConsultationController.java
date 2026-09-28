package com.petcare.controller;

import com.petcare.model.Consultation;
import com.petcare.model.ConsultationStatus;
import com.petcare.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/pets/{petId}/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final ObjectMapper objectMapper;
    public ConsultationController(ConsultationService consultationService, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.consultationService = consultationService;
    }

    @PostMapping
    public ResponseEntity<Consultation> createConsultation(@PathVariable Long userId,
                                                           @PathVariable Long petId,
                                                           @Valid @RequestBody String consultationJson) {
        Consultation consultation = objectMapper.readValue(consultationJson, Consultation.class);
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
                                                              @RequestBody String consultationsJson) {
        List<Consultation> consultations = objectMapper.readValue(consultationsJson, List.class);
        return ResponseEntity.ok(consultations);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consultation> updateConsultation(@PathVariable Long userId,
                                                          @PathVariable Long petId,
                                                          @PathVariable Long id,
                                                          @Valid @RequestBody String consultationJson) {
        Consultation consultation = objectMapper.readValue(consultationJson, Consultation.class);
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
