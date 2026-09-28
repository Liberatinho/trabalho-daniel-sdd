package com.petcare.controller;

import com.petcare.model.Vaccine;
import com.petcare.service.VaccineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/pets/{petId}/vaccines")
public class VaccineController {

    private final VaccineService vaccineService;

    public VaccineController(VaccineService vaccineService) {
        this.vaccineService = vaccineService;
    }

    @PostMapping
    public ResponseEntity<Vaccine> createVaccine(@PathVariable Long userId,
                                                 @PathVariable Long petId,
                                                 @Valid @RequestBody Vaccine vaccine) {
        Vaccine created = vaccineService.createVaccine(userId, petId, vaccine);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vaccine> getVaccine(@PathVariable Long userId,
                                              @PathVariable Long petId,
                                              @PathVariable Long id) {
        Vaccine vaccine = vaccineService.getVaccine(userId, petId, id);
        return ResponseEntity.ok(vaccine);
    }

    @GetMapping
    public ResponseEntity<List<Vaccine>> getVaccines(@PathVariable Long userId,
                                                     @PathVariable Long petId) {
        List<Vaccine> vaccines = vaccineService.getVaccines(userId, petId);
        return ResponseEntity.ok(vaccines);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaccine> updateVaccine(@PathVariable Long userId,
                                                 @PathVariable Long petId,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody Vaccine vaccine) {
        Vaccine updated = vaccineService.updateVaccine(userId, petId, id, vaccine);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccine(@PathVariable Long userId,
                                              @PathVariable Long petId,
                                              @PathVariable Long id) {
        vaccineService.deleteVaccine(userId, petId, id);
        return ResponseEntity.noContent().build();
    }
}
