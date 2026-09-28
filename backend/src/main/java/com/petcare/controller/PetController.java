package com.petcare.controller;

import com.petcare.model.Pet;
import com.petcare.service.PetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/pets")
public class PetController {

    private final PetService petService;
    private final ObjectMapper objectMapper;

    public PetController(PetService petService, ObjectMapper objectMapper) {
        this.petService = petService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<Pet> createPet(@PathVariable Long userId, @Valid @RequestBody String petJson) {
        Pet pet = objectMapper.readValue(petJson, Pet.class);
        Pet createdPet = petService.createPet(pet, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPet);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long userId, @PathVariable Long id) {
        Pet pet = petService.getPetByIdAndUser(id, userId);
        return ResponseEntity.ok(pet);
    }

    @GetMapping
    public ResponseEntity<List<Pet>> getPetsByUser(@PathVariable Long userId, @RequestBody String petsJson) {
        List<Pet> pets = objectMapper.readValue(petsJson, List.class);
        List<Pet> pets = petService.getPetsByUser(userId);
        return ResponseEntity.ok(pets);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(@PathVariable Long userId, @PathVariable Long id, @Valid @RequestBody String petJson) {
        Pet pet = objectMapper.readValue(petJson, Pet.class);
        Pet updatedPet = petService.updatePet(id, userId, pet);
        return ResponseEntity.ok(updatedPet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long userId, @PathVariable Long id) {
        petService.deletePet(id, userId);
        return ResponseEntity.noContent().build();
    }
}
