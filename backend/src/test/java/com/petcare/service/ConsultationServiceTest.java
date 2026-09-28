package com.petcare.service;

import com.petcare.model.Consultation;
import com.petcare.model.ConsultationStatus;
import com.petcare.model.Pet;
import com.petcare.model.User;
import com.petcare.repository.ConsultationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConsultationServiceTest {

    @Mock
    private ConsultationRepository consultationRepository;

    @Mock
    private PetService petService;

    @InjectMocks
    private ConsultationService consultationService;

    private Pet pet;
    private Consultation scheduled;

    @BeforeEach
    void setUp() {
        User user = new User("Maria", "maria@email.com", "senha");
        user.setId(1L);
        pet = new Pet("Rex", "Cão", user);
        pet.setId(10L);

        scheduled = new Consultation(LocalDateTime.now().plusDays(1), "Dr. House", "Check-up", pet);
        scheduled.setId(100L);
        scheduled.setStatus(ConsultationStatus.SCHEDULED);
    }

    @Test
    void createConsultation_Success() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(consultationRepository.save(any(Consultation.class))).thenReturn(scheduled);

        Consultation input = new Consultation(LocalDateTime.now().plusDays(1), "Dr. House", "Check-up", null);
        Consultation result = consultationService.createConsultation(1L, 10L, input);

        assertNotNull(result);
        assertEquals(pet, input.getPet());
        assertEquals(ConsultationStatus.SCHEDULED, input.getStatus(), "Status padrão deve ser SCHEDULED");
        verify(consultationRepository, times(1)).save(input);
    }

    @Test
    void createConsultation_PetNotOwned_ThrowsSecurity() {
        when(petService.getPetByIdAndUser(10L, 1L))
                .thenThrow(new SecurityException("Pet não pertence ao usuário ou não existe"));

        Consultation input = new Consultation(LocalDateTime.now(), "Dr. House", "Check-up", null);

        assertThrows(SecurityException.class,
                () -> consultationService.createConsultation(1L, 10L, input));
        verify(consultationRepository, never()).save(any());
    }

    @Test
    void updateConsultation_CancelledCannotBeChanged_ThrowsBadRequest() {
        scheduled.setStatus(ConsultationStatus.CANCELLED);
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(consultationRepository.existsByIdAndPetId(100L, 10L)).thenReturn(true);
        when(consultationRepository.findById(100L)).thenReturn(Optional.of(scheduled));

        Consultation details = new Consultation(LocalDateTime.now(), "Dr. House", "Retorno", pet);
        details.setStatus(ConsultationStatus.COMPLETED);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> consultationService.updateConsultation(1L, 10L, 100L, details));
        assertEquals("Consulta cancelada não pode ser alterada", ex.getMessage());
        verify(consultationRepository, never()).save(any());
    }

    @Test
    void updateConsultation_CompletedCannotGoBackToScheduled_ThrowsBadRequest() {
        scheduled.setStatus(ConsultationStatus.COMPLETED);
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(consultationRepository.existsByIdAndPetId(100L, 10L)).thenReturn(true);
        when(consultationRepository.findById(100L)).thenReturn(Optional.of(scheduled));

        Consultation details = new Consultation(LocalDateTime.now(), "Dr. House", "Retorno", pet);
        details.setStatus(ConsultationStatus.SCHEDULED);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> consultationService.updateConsultation(1L, 10L, 100L, details));
        assertEquals("Consulta realizada não pode voltar para agendada", ex.getMessage());
        verify(consultationRepository, never()).save(any());
    }

    @Test
    void updateConsultation_ScheduledToCompleted_Success() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(consultationRepository.existsByIdAndPetId(100L, 10L)).thenReturn(true);
        when(consultationRepository.findById(100L)).thenReturn(Optional.of(scheduled));
        when(consultationRepository.save(any(Consultation.class))).thenAnswer(inv -> inv.getArgument(0));

        Consultation details = new Consultation(LocalDateTime.now(), "Dr. House", "Consulta realizada", pet);
        details.setStatus(ConsultationStatus.COMPLETED);

        Consultation result = consultationService.updateConsultation(1L, 10L, 100L, details);

        assertEquals(ConsultationStatus.COMPLETED, result.getStatus());
        verify(consultationRepository, times(1)).save(scheduled);
    }

    @Test
    void getConsultation_NotFoundForPet_ThrowsNotFound() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(consultationRepository.existsByIdAndPetId(999L, 10L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class,
                () -> consultationService.getConsultation(1L, 10L, 999L));
    }

    @Test
    void getConsultations_WithStatusFilter_UsesFilteredQuery() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(consultationRepository.findByPetIdAndStatus(10L, ConsultationStatus.SCHEDULED))
                .thenReturn(Arrays.asList(scheduled));

        List<Consultation> result = consultationService.getConsultations(1L, 10L, ConsultationStatus.SCHEDULED);

        assertEquals(1, result.size());
        verify(consultationRepository, times(1)).findByPetIdAndStatus(10L, ConsultationStatus.SCHEDULED);
        verify(consultationRepository, never()).findByPetId(anyLong());
    }

    @Test
    void getConsultations_WithoutFilter_ReturnsAll() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(consultationRepository.findByPetId(10L)).thenReturn(Arrays.asList(scheduled));

        List<Consultation> result = consultationService.getConsultations(1L, 10L, null);

        assertEquals(1, result.size());
        verify(consultationRepository, times(1)).findByPetId(10L);
    }

    @Test
    void deleteConsultation_Success() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(consultationRepository.existsByIdAndPetId(100L, 10L)).thenReturn(true);
        when(consultationRepository.findById(100L)).thenReturn(Optional.of(scheduled));

        assertDoesNotThrow(() -> consultationService.deleteConsultation(1L, 10L, 100L));
        verify(consultationRepository, times(1)).delete(scheduled);
    }
}
