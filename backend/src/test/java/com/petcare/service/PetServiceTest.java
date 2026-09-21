package com.petcare.service;

import com.petcare.model.Pet;
import com.petcare.model.User;
import com.petcare.repository.PetRepository;
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
class PetServiceTest {

    @Mock
    private PetRepository petRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private PetService petService;

    private User testUser;
    private Pet testPet;

    @BeforeEach
    void setUp() {
        testUser = new User("João Silva", "joao@email.com", "senha123");
        testUser.setId(1L);

        testPet = new Pet("Rex", "Cachorro", "Labrador");
        testPet.setBirthDate(LocalDate.of(2020, 3, 15));
        testPet.setUser(testUser);
        testPet.setId(1L);
    }

    @Test
    void createPet_Success() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(petRepository.save(any(Pet.class))).thenReturn(testPet);

        Pet result = petService.createPet(testPet, 1L);

        assertNotNull(result);
        assertEquals("Rex", result.getName());
        assertEquals(testUser, result.getUser());
        verify(petRepository, times(1)).save(testPet);
    }

    @Test
    void getPetById_Success() {
        when(petRepository.findById(1L)).thenReturn(Optional.of(testPet));

        Pet result = petService.getPetById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Rex", result.getName());
    }

    @Test
    void getPetById_NotFound_ThrowsException() {
        when(petRepository.findById(99L)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            petService.getPetById(99L);
        });

        assertEquals("Pet não encontrado: 99", exception.getMessage());
    }

    @Test
    void getPetByIdAndUser_Success() {
        when(petRepository.existsByIdAndUserId(1L, 1L)).thenReturn(true);
        when(petRepository.findById(1L)).thenReturn(Optional.of(testPet));

        Pet result = petService.getPetByIdAndUser(1L, 1L);

        assertNotNull(result);
        assertEquals(testUser, result.getUser());
    }

    @Test
    void getPetByIdAndUser_PetNotBelongsToUser_ThrowsException() {
        when(petRepository.existsByIdAndUserId(1L, 2L)).thenReturn(false);

        SecurityException exception = assertThrows(SecurityException.class, () -> {
            petService.getPetByIdAndUser(1L, 2L);
        });

        assertEquals("Pet não pertence ao usuário ou não existe", exception.getMessage());
    }

    @Test
    void getPetsByUser_Success() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(petRepository.findByUserId(1L)).thenReturn(Arrays.asList(testPet));

        List<Pet> result = petService.getPetsByUser(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Rex", result.get(0).getName());
    }

    @Test
    void updatePet_Success() {
        Pet updatedData = new Pet("Rex Atualizado", "Cachorro", "Labrador Retriever");
        updatedData.setNotes("Muito brincalhão");

        when(petRepository.existsByIdAndUserId(1L, 1L)).thenReturn(true);
        when(petRepository.findById(1L)).thenReturn(Optional.of(testPet));
        when(petRepository.save(any(Pet.class))).thenReturn(testPet);

        Pet result = petService.updatePet(1L, 1L, updatedData);

        assertNotNull(result);
        assertEquals("Rex Atualizado", result.getName());
        assertEquals("Muito brincalhão", result.getNotes());
    }

    @Test
    void deletePet_Success() {
        when(petRepository.existsByIdAndUserId(1L, 1L)).thenReturn(true);
        when(petRepository.findById(1L)).thenReturn(Optional.of(testPet));
        doNothing().when(petRepository).delete(testPet);

        assertDoesNotThrow(() -> petService.deletePet(1L, 1L));
        verify(petRepository, times(1)).delete(testPet);
    }
}
