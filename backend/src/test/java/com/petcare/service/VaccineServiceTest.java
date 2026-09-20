package com.petcare.service;

import com.petcare.model.Pet;
import com.petcare.model.User;
import com.petcare.model.Vaccine;
import com.petcare.repository.VaccineRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VaccineServiceTest {

    @Mock
    private VaccineRepository vaccineRepository;

    @Mock
    private PetService petService;

    @InjectMocks
    private VaccineService vaccineService;

    private Pet pet;
    private Vaccine vaccine;

    @BeforeEach
    void setUp() {
        User user = new User("Maria", "maria@email.com", "senha");
        user.setId(1L);
        pet = new Pet("Rex", "Cão", user);
        pet.setId(10L);

        vaccine = new Vaccine("V10", LocalDate.of(2026, 1, 10), pet);
        vaccine.setId(100L);
        vaccine.setNextDoseDate(LocalDate.of(2026, 7, 10));
    }

    @Test
    void createVaccine_Success() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(vaccineRepository.save(any(Vaccine.class))).thenAnswer(inv -> inv.getArgument(0));

        Vaccine input = new Vaccine("V10", LocalDate.of(2026, 1, 10), null);
        input.setNextDoseDate(LocalDate.of(2026, 7, 10));

        Vaccine result = vaccineService.createVaccine(1L, 10L, input);

        assertNotNull(result);
        assertEquals(pet, input.getPet());
        verify(vaccineRepository, times(1)).save(input);
    }

    @Test
    void createVaccine_PetNotOwned_ThrowsSecurity() {
        when(petService.getPetByIdAndUser(10L, 1L))
                .thenThrow(new SecurityException("Pet não pertence ao usuário ou não existe"));

        Vaccine input = new Vaccine("V10", LocalDate.of(2026, 1, 10), null);

        assertThrows(SecurityException.class,
                () -> vaccineService.createVaccine(1L, 10L, input));
        verify(vaccineRepository, never()).save(any());
    }

    @Test
    void createVaccine_NextDoseBeforeApplication_ThrowsBadRequest() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);

        Vaccine input = new Vaccine("V10", LocalDate.of(2026, 1, 10), null);
        input.setNextDoseDate(LocalDate.of(2025, 12, 31)); // antes da aplicação

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> vaccineService.createVaccine(1L, 10L, input));
        assertEquals("Próxima dose não pode ser anterior à data de aplicação", ex.getMessage());
        verify(vaccineRepository, never()).save(any());
    }

    @Test
    void createVaccine_WithoutNextDose_Success() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(vaccineRepository.save(any(Vaccine.class))).thenAnswer(inv -> inv.getArgument(0));

        Vaccine input = new Vaccine("V10", LocalDate.of(2026, 1, 10), null);
        input.setNextDoseDate(null); // opcional

        assertDoesNotThrow(() -> vaccineService.createVaccine(1L, 10L, input));
        verify(vaccineRepository, times(1)).save(input);
    }

    @Test
    void updateVaccine_InvalidDates_ThrowsBadRequest() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(vaccineRepository.existsByIdAndPetId(100L, 10L)).thenReturn(true);
        when(vaccineRepository.findById(100L)).thenReturn(Optional.of(vaccine));

        Vaccine details = new Vaccine("V10", LocalDate.of(2026, 1, 10), pet);
        details.setNextDoseDate(LocalDate.of(2025, 1, 1));

        assertThrows(IllegalArgumentException.class,
                () -> vaccineService.updateVaccine(1L, 10L, 100L, details));
        verify(vaccineRepository, never()).save(any());
    }

    @Test
    void getVaccine_NotFoundForPet_ThrowsNotFound() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(vaccineRepository.existsByIdAndPetId(999L, 10L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class,
                () -> vaccineService.getVaccine(1L, 10L, 999L));
    }

    @Test
    void getVaccines_ReturnsList() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(vaccineRepository.findByPetId(10L)).thenReturn(Arrays.asList(vaccine));

        List<Vaccine> result = vaccineService.getVaccines(1L, 10L);

        assertEquals(1, result.size());
        verify(vaccineRepository, times(1)).findByPetId(10L);
    }

    @Test
    void deleteVaccine_Success() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(vaccineRepository.existsByIdAndPetId(100L, 10L)).thenReturn(true);
        when(vaccineRepository.findById(100L)).thenReturn(Optional.of(vaccine));

        assertDoesNotThrow(() -> vaccineService.deleteVaccine(1L, 10L, 100L));
        verify(vaccineRepository, times(1)).delete(vaccine);
    }
}
