package com.petcare.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.exception.GlobalExceptionHandler;
import com.petcare.model.Consultation;
import com.petcare.model.ConsultationStatus;
import com.petcare.service.ConsultationService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ConsultationController.class)
@Import(GlobalExceptionHandler.class)
class ConsultationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ConsultationService consultationService;

    @Autowired
    private ObjectMapper objectMapper;

    private Consultation consultation;

    @BeforeEach
    void setUp() {
        consultation = new Consultation(LocalDateTime.now().plusDays(1), "Dr. House", "Check-up", null);
        consultation.setId(100L);
        consultation.setStatus(ConsultationStatus.SCHEDULED);
    }

    @Test
    void createConsultation_Success() throws Exception {
        when(consultationService.createConsultation(eq(1L), eq(10L), any(Consultation.class)))
                .thenReturn(consultation);

        mockMvc.perform(post("/api/users/1/pets/10/consultations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(consultation)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.veterinarian").value("Dr. House"))
                .andExpect(jsonPath("$.status").value("SCHEDULED"));
    }

    @Test
    void getConsultations_WithStatusFilter_Success() throws Exception {
        when(consultationService.getConsultations(1L, 10L, ConsultationStatus.SCHEDULED))
                .thenReturn(Arrays.asList(consultation));

        mockMvc.perform(get("/api/users/1/pets/10/consultations?status=SCHEDULED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        verify(consultationService, times(1)).getConsultations(1L, 10L, ConsultationStatus.SCHEDULED);
    }

    @Test
    void updateConsultation_InvalidTransition_Returns400() throws Exception {
        when(consultationService.updateConsultation(eq(1L), eq(10L), eq(100L), any(Consultation.class)))
                .thenThrow(new IllegalArgumentException("Consulta cancelada não pode ser alterada"));

        mockMvc.perform(put("/api/users/1/pets/10/consultations/100")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(consultation)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Consulta cancelada não pode ser alterada"));
    }

    @Test
    void getConsultation_NotFound_Returns404() throws Exception {
        when(consultationService.getConsultation(1L, 10L, 999L))
                .thenThrow(new EntityNotFoundException("Consulta não encontrada para o pet: 999"));

        mockMvc.perform(get("/api/users/1/pets/10/consultations/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteConsultation_Success() throws Exception {
        doNothing().when(consultationService).deleteConsultation(1L, 10L, 100L);

        mockMvc.perform(delete("/api/users/1/pets/10/consultations/100"))
                .andExpect(status().isNoContent());

        verify(consultationService, times(1)).deleteConsultation(1L, 10L, 100L);
    }
}
