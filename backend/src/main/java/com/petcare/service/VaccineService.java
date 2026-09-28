package com.petcare.service;

import com.petcare.model.Pet;
import com.petcare.model.Vaccine;
import com.petcare.repository.VaccineRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Regras de negócio de Vacinas (REQ-003).
 * - Ownership: a vacina pertence a um pet do usuário autenticado.
 * - Se informada, a próxima dose (nextDoseDate) não pode ser anterior à data de aplicação.
 */
@Service
@Transactional
public class VaccineService {

    private final VaccineRepository vaccineRepository;
    private final PetService petService;

    public VaccineService(VaccineRepository vaccineRepository, PetService petService) {
        this.vaccineRepository = vaccineRepository;
        this.petService = petService;
    }

    public Vaccine createVaccine(Long userId, Long petId, Vaccine vaccine) {
        Pet pet = petService.getPetByIdAndUser(petId, userId);
        vaccine.setPet(pet);
        validateDates(vaccine);
        return vaccineRepository.save(vaccine);
    }

    @Transactional(readOnly = true)
    public Vaccine getVaccine(Long userId, Long petId, Long id) {
        petService.getPetByIdAndUser(petId, userId);
        return getVaccineOfPet(id, petId);
    }

    @Transactional(readOnly = true)
    public List<Vaccine> getVaccines(Long userId, Long petId) {
        petService.getPetByIdAndUser(petId, userId);
        return vaccineRepository.findByPetId(petId);
    }

    public Vaccine updateVaccine(Long userId, Long petId, Long id, Vaccine details) {
        petService.getPetByIdAndUser(petId, userId);
        Vaccine vaccine = getVaccineOfPet(id, petId);

        vaccine.setName(details.getName());
        vaccine.setApplicationDate(details.getApplicationDate());
        vaccine.setNextDoseDate(details.getNextDoseDate());
        vaccine.setNotes(details.getNotes());

        validateDates(vaccine);
        return vaccineRepository.save(vaccine);
    }

    public void deleteVaccine(Long userId, Long petId, Long id) {
        petService.getPetByIdAndUser(petId, userId);
        Vaccine vaccine = getVaccineOfPet(id, petId);
        vaccineRepository.delete(vaccine);
    }

    /**
     * Regra de negócio do REQ-003: a próxima dose, quando informada,
     * não pode ser anterior à data de aplicação.
     * @throws IllegalArgumentException mapeado para HTTP 400.
     */
    private void validateDates(Vaccine vaccine) {
        if (vaccine.getNextDoseDate() != null
                && vaccine.getApplicationDate() != null
                && vaccine.getNextDoseDate().isBefore(vaccine.getApplicationDate())) {
            throw new IllegalArgumentException("Próxima dose não pode ser anterior à data de aplicação");
        }
    }

    private Vaccine getVaccineOfPet(Long id, Long petId) {
        if (!vaccineRepository.existsByIdAndPetId(id, petId)) {
            throw new EntityNotFoundException("Vacina não encontrada para o pet: " + id);
        }
        return vaccineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vacina não encontrada: " + id));
    }
}
