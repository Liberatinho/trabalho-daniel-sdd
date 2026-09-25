package com.petcare.service;

import com.petcare.model.Pet;
import com.petcare.model.User;
import com.petcare.repository.PetRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PetService {

    private final PetRepository petRepository;
    private final UserService userService;

    public PetService(PetRepository petRepository, UserService userService) {
        this.petRepository = petRepository;
        this.userService = userService;
    }

    public Pet createPet(Pet pet, Long userId) {
        User user = userService.getUserById(userId);
        pet.setUser(user);
        return petRepository.save(pet);
    }

    @Transactional(readOnly = true)
    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public Pet getPetByIdAndUser(Long id, Long userId) {
        if (!petRepository.existsByIdAndUserId(id, userId)) {
            throw new SecurityException("Pet não pertence ao usuário ou não existe");
        }
        return getPetById(id);
    }

    @Transactional(readOnly = true)
    public List<Pet> getPetsByUser(Long userId) {
        userService.getUserById(userId);
        return petRepository.findByUserId(userId);
    }

    public Pet updatePet(Long id, Long userId, Pet petDetails) {
        Pet pet = getPetByIdAndUser(id, userId);
        pet.setName(petDetails.getName());
        pet.setSpecies(petDetails.getSpecies());
        pet.setBreed(petDetails.getBreed());
        pet.setBirthDate(petDetails.getBirthDate());
        pet.setNotes(petDetails.getNotes());
        return petRepository.save(pet);
    }

    public void deletePet(Long id, Long userId) {
        Pet pet = getPetByIdAndUser(id, userId);
        petRepository.delete(pet);
    }
}
