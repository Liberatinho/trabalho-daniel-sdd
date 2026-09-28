package com.petcare.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.exception.GlobalExceptionHandler;
import com.petcare.model.Vaccine;
import com.petcare.service.VaccineService;
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

@WebMvcTest(VaccineController.class)
@Import(GlobalExceptionHandler.class)
class VaccineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VaccineService vaccineService;

    @Autowired
    private ObjectMapper objectMapper;

    private Vaccine vaccine;

    @BeforeEach
    void setUp() {
        vaccine = new Vaccine("V10", LocalDate.of(2026, 1, 10), null);
        vaccine.setId(100L);
        vaccine.setNextDoseDate(LocalDate.of(2026, 7, 10));
    }

    @Test
    void createVaccine_Success() throws Exception {
        when(vaccineService.createVaccine(eq(1L), eq(10L), any(Vaccine.class))).thenReturn(vaccine);

        mockMvc.perform(post("/api/users/1/pets/10/vaccines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vaccine)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("V10"));
    }

    @Test
    void getVaccines_Success() throws Exception {
        when(vaccineService.getVaccines(1L, 10L)).thenReturn(Arrays.asList(vaccine));

        mockMvc.perform(get("/api/users/1/pets/10/vaccines"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void createVaccine_InvalidDates_Returns400() throws Exception {
        when(vaccineService.createVaccine(eq(1L), eq(10L), any(Vaccine.class)))
                .thenThrow(new IllegalArgumentException("Próxima dose não pode ser anterior à data de aplicação"));

        mockMvc.perform(post("/api/users/1/pets/10/vaccines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vaccine)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Próxima dose não pode ser anterior à data de aplicação"));
    }

    @Test
    void getVaccine_NotFound_Returns404() throws Exception {
        when(vaccineService.getVaccine(1L, 10L, 999L))
                .thenThrow(new EntityNotFoundException("Vacina não encontrada para o pet: 999"));

        mockMvc.perform(get("/api/users/1/pets/10/vaccines/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteVaccine_Success() throws Exception {
        doNothing().when(vaccineService).deleteVaccine(1L, 10L, 100L);

        mockMvc.perform(delete("/api/users/1/pets/10/vaccines/100"))
                .andExpect(status().isNoContent());

        verify(vaccineService, times(1)).deleteVaccine(1L, 10L, 100L);
    }
}
