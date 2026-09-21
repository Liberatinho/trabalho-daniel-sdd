package com.petcare.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.model.Pet;
import com.petcare.model.User;
import com.petcare.service.PetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PetController.class)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetService petService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void createPet_Success() throws Exception {
        when(petService.createPet(any(Pet.class), eq(1L))).thenReturn(testPet);

        mockMvc.perform(post("/api/users/1/pets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testPet)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Rex"))
                .andExpect(jsonPath("$.species").value("Cachorro"));

        verify(petService, times(1)).createPet(any(Pet.class), eq(1L));
    }

    @Test
    void getPetById_Success() throws Exception {
        when(petService.getPetByIdAndUser(1L, 1L)).thenReturn(testPet);

        mockMvc.perform(get("/api/users/1/pets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Rex"))
                .andExpect(jsonPath("$.species").value("Cachorro"));
    }

    @Test
    void getPetsByUser_Success() throws Exception {
        when(petService.getPetsByUser(1L)).thenReturn(Arrays.asList(testPet));

        mockMvc.perform(get("/api/users/1/pets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Rex"));
    }

    @Test
    void updatePet_Success() throws Exception {
        Pet updatedPet = new Pet("Rex Atualizado", "Cachorro", "Labrador Retriever");
        updatedPet.setId(1L);

        when(petService.updatePet(eq(1L), eq(1L), any(Pet.class))).thenReturn(updatedPet);

        mockMvc.perform(put("/api/users/1/pets/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedPet)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Rex Atualizado"));
    }

    @Test
    void deletePet_Success() throws Exception {
        doNothing().when(petService).deletePet(1L, 1L);

        mockMvc.perform(delete("/api/users/1/pets/1"))
                .andExpect(status().isNoContent());

        verify(petService, times(1)).deletePet(1L, 1L);
    }
}
