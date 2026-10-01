package com.petcare.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.exception.GlobalExceptionHandler;
import com.petcare.model.Pet;
import com.petcare.model.User;
import com.petcare.service.PetService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PetController.class)
@Import(GlobalExceptionHandler.class)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetService petService;

    @Autowired
    private ObjectMapper objectMapper;

    private Pet pet;

    @BeforeEach
    void setUp() {
        pet = new Pet("Rex", "Cão", null);
        pet.setId(10L);
        pet.setBreed("Labrador");
        pet.setBirthDate(LocalDate.of(2020, 3, 12));
        pet.setNotes("Muito dócil");
        User user = new User("Maria Silva", "maria@email.com", "12345678901", "São Paulo", "senha123");
        user.addPet(pet);
    }

    @Test
    void createPet_Success() throws Exception {
        when(petService.createPet(any(Pet.class), eq(1L))).thenReturn(pet);

        mockMvc.perform(post("/api/users/1/pets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pet)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.name").value("Rex"))
                .andExpect(jsonPath("$.species").value("Cão"));

        verify(petService, times(1)).createPet(any(Pet.class), eq(1L));
    }

    @Test
    void createPet_MissingName_Returns400() throws Exception {
        Pet invalidPet = new Pet("", "Cão", null);

        mockMvc.perform(post("/api/users/1/pets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPet)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.name").value("Nome é obrigatório"));

        verify(petService, never()).createPet(any(), any());
    }

    @Test
    void createPet_MissingSpecies_Returns400() throws Exception {
        Pet invalidPet = new Pet("Rex", "", null);

        mockMvc.perform(post("/api/users/1/pets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPet)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.species").value("Espécie é obrigatória"));

        verify(petService, never()).createPet(any(), any());
    }

    @Test
    void getPetsByUser_Success() throws Exception {
        when(petService.getPetsByUser(1L)).thenReturn(Arrays.asList(pet));

        mockMvc.perform(get("/api/users/1/pets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Rex"));

        verify(petService, times(1)).getPetsByUser(1L);
    }

    @Test
    void getPetById_Success() throws Exception {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);

        mockMvc.perform(get("/api/users/1/pets/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.name").value("Rex"));

        verify(petService, times(1)).getPetByIdAndUser(10L, 1L);
    }

    @Test
    void getPetById_NotFound_Returns404() throws Exception {
        when(petService.getPetByIdAndUser(999L, 1L))
                .thenThrow(new EntityNotFoundException("Pet não encontrado: 999"));

        mockMvc.perform(get("/api/users/1/pets/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Pet não encontrado: 999"));
    }

    @Test
    void getPetById_NotOwned_Returns403() throws Exception {
        when(petService.getPetByIdAndUser(10L, 2L))
                .thenThrow(new SecurityException("Pet não pertence ao usuário ou não existe"));

        mockMvc.perform(get("/api/users/2/pets/10"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value("Pet não pertence ao usuário ou não existe"));
    }

    @Test
    void updatePet_Success() throws Exception {
        Pet updatedPet = new Pet("Rex Atualizado", "Cão", null);
        updatedPet.setId(10L);
        when(petService.updatePet(eq(10L), eq(1L), any(Pet.class))).thenReturn(updatedPet);

        mockMvc.perform(put("/api/users/1/pets/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedPet)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Rex Atualizado"));

        verify(petService, times(1)).updatePet(eq(10L), eq(1L), any(Pet.class));
    }

    @Test
    void updatePet_MissingName_Returns400() throws Exception {
        Pet invalidPet = new Pet("", "Cão", null);

        mockMvc.perform(put("/api/users/1/pets/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPet)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.name").value("Nome é obrigatório"));

        verify(petService, never()).updatePet(any(), any(), any());
    }

    @Test
    void updatePet_NotFound_Returns404() throws Exception {
        when(petService.updatePet(eq(999L), eq(1L), any(Pet.class)))
                .thenThrow(new EntityNotFoundException("Pet não encontrado: 999"));

        mockMvc.perform(put("/api/users/1/pets/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pet)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void updatePet_NotOwned_Returns403() throws Exception {
        when(petService.updatePet(eq(10L), eq(2L), any(Pet.class)))
                .thenThrow(new SecurityException("Pet não pertence ao usuário ou não existe"));

        mockMvc.perform(put("/api/users/2/pets/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pet)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value("Pet não pertence ao usuário ou não existe"));
    }

    @Test
    void deletePet_Success() throws Exception {
        doNothing().when(petService).deletePet(10L, 1L);

        mockMvc.perform(delete("/api/users/1/pets/10"))
                .andExpect(status().isNoContent());

        verify(petService, times(1)).deletePet(10L, 1L);
    }

    @Test
    void deletePet_NotFound_Returns404() throws Exception {
        doThrow(new EntityNotFoundException("Pet não encontrado: 999"))
                .when(petService).deletePet(999L, 1L);

        mockMvc.perform(delete("/api/users/1/pets/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void deletePet_NotOwned_Returns403() throws Exception {
        doThrow(new SecurityException("Pet não pertence ao usuário ou não existe"))
                .when(petService).deletePet(10L, 2L);

        mockMvc.perform(delete("/api/users/2/pets/10"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value("Pet não pertence ao usuário ou não existe"));
    }
}
