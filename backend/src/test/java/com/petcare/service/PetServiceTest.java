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

    private User user;
    private Pet pet;

    @BeforeEach
    void setUp() {
        user = new User("Maria Silva", "maria@email.com", "senha123");
        user.setId(1L);

        pet = new Pet("Rex", "Cão", user);
        pet.setId(10L);
        pet.setBreed("Labrador");
        pet.setBirthDate(LocalDate.of(2020, 3, 12));
        pet.setNotes("Muito dócil");
    }

    @Test
    void createPet_Success() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(petRepository.save(any(Pet.class))).thenAnswer(inv -> inv.getArgument(0));

        Pet newPet = new Pet("Rex", "Cão", null);
        Pet result = petService.createPet(newPet, 1L);

        assertNotNull(result);
        assertEquals(user, result.getUser());
        verify(userService, times(1)).getUserById(1L);
        verify(petRepository, times(1)).save(newPet);
    }

    @Test
    void createPet_UserNotFound_ThrowsNotFound() {
        when(userService.getUserById(999L)).thenThrow(new EntityNotFoundException("Usuário não encontrado: 999"));

        Pet newPet = new Pet("Rex", "Cão", null);

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> petService.createPet(newPet, 999L));
        assertEquals("Usuário não encontrado: 999", ex.getMessage());
        verify(petRepository, never()).save(any());
    }

    @Test
    void getPetById_Success() {
        when(petRepository.findById(10L)).thenReturn(Optional.of(pet));

        Pet result = petService.getPetById(10L);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Rex", result.getName());
    }

    @Test
    void getPetById_NotFound_ThrowsNotFound() {
        when(petRepository.findById(999L)).thenReturn(Optional.empty());

        EntityNotFoundException ex = assertThrows(EntityNotFoundException.class,
                () -> petService.getPetById(999L));
        assertEquals("Pet não encontrado: 999", ex.getMessage());
    }

    @Test
    void getPetByIdAndUser_Success() {
        when(petRepository.existsByIdAndUserId(10L, 1L)).thenReturn(true);
        when(petRepository.findById(10L)).thenReturn(Optional.of(pet));

        Pet result = petService.getPetByIdAndUser(10L, 1L);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Rex", result.getName());
    }

    @Test
    void getPetByIdAndUser_NotOwned_ThrowsSecurityException() {
        when(petRepository.existsByIdAndUserId(10L, 2L)).thenReturn(false);

        SecurityException ex = assertThrows(SecurityException.class,
                () -> petService.getPetByIdAndUser(10L, 2L));
        assertEquals("Pet não pertence ao usuário ou não existe", ex.getMessage());
        verify(petRepository, never()).findById(any());
    }

    @Test
    void getPetsByUser_Success() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(petRepository.findByUserId(1L)).thenReturn(Arrays.asList(pet));

        List<Pet> pets = petService.getPetsByUser(1L);

        assertEquals(1, pets.size());
        assertEquals("Rex", pets.get(0).getName());
        verify(userService, times(1)).getUserById(1L);
        verify(petRepository, times(1)).findByUserId(1L);
    }

    @Test
    void getPetsByUser_UserNotFound_ThrowsNotFound() {
        when(userService.getUserById(999L)).thenThrow(new EntityNotFoundException("Usuário não encontrado: 999"));

        assertThrows(EntityNotFoundException.class,
                () -> petService.getPetsByUser(999L));
        verify(petRepository, never()).findByUserId(any());
    }

    @Test
    void updatePet_Success() {
        when(petRepository.existsByIdAndUserId(10L, 1L)).thenReturn(true);
        when(petRepository.findById(10L)).thenReturn(Optional.of(pet));
        when(petRepository.save(any(Pet.class))).thenAnswer(inv -> inv.getArgument(0));

        Pet updatedDetails = new Pet();
        updatedDetails.setName("Rex Atualizado");
        updatedDetails.setSpecies("Cão");
        updatedDetails.setBreed("Golden Retriever");
        updatedDetails.setBirthDate(LocalDate.of(2020, 4, 1));
        updatedDetails.setNotes("Atualizado");

        Pet result = petService.updatePet(10L, 1L, updatedDetails);

        assertEquals("Rex Atualizado", result.getName());
        assertEquals("Golden Retriever", result.getBreed());
        assertEquals(LocalDate.of(2020, 4, 1), result.getBirthDate());
        assertEquals("Atualizado", result.getNotes());
        verify(petRepository, times(1)).save(pet);
    }

    @Test
    void updatePet_NotOwned_ThrowsSecurityException() {
        when(petRepository.existsByIdAndUserId(10L, 2L)).thenReturn(false);

        Pet updatedDetails = new Pet();
        updatedDetails.setName("Rex Alterado");

        assertThrows(SecurityException.class,
                () -> petService.updatePet(10L, 2L, updatedDetails));
        verify(petRepository, never()).save(any());
    }

    @Test
    void deletePet_Success() {
        when(petRepository.existsByIdAndUserId(10L, 1L)).thenReturn(true);
        when(petRepository.findById(10L)).thenReturn(Optional.of(pet));

        assertDoesNotThrow(() -> petService.deletePet(10L, 1L));
        verify(petRepository, times(1)).delete(pet);
    }

    @Test
    void deletePet_NotOwned_ThrowsSecurityException() {
        when(petRepository.existsByIdAndUserId(10L, 2L)).thenReturn(false);

        assertThrows(SecurityException.class,
                () -> petService.deletePet(10L, 2L));
        verify(petRepository, never()).delete(any());
    }
}
