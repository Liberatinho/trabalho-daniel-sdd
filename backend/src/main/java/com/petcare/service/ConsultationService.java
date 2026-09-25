package com.petcare.service;

import com.petcare.model.Consultation;
import com.petcare.model.ConsultationStatus;
import com.petcare.model.Pet;
import com.petcare.repository.ConsultationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Regras de negócio de Consultas Veterinárias (REQ-004).
 * - Ownership: a consulta pertence a um pet do usuário autenticado.
 * - Consulta CANCELLED é terminal: não pode ser alterada.
 * - Consulta COMPLETED não pode voltar para SCHEDULED.
 */
@Service
@Transactional
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PetService petService;

    public ConsultationService(ConsultationRepository consultationRepository, PetService petService) {
        this.consultationRepository = consultationRepository;
        this.petService = petService;
    }

    public Consultation createConsultation(Long userId, Long petId, Consultation consultation) {
        Pet pet = petService.getPetByIdAndUser(petId, userId);
        consultation.setPet(pet);
        if (consultation.getStatus() == null) {
            consultation.setStatus(ConsultationStatus.SCHEDULED);
        }
        return consultationRepository.save(consultation);
    }

    @Transactional(readOnly = true)
    public Consultation getConsultation(Long userId, Long petId, Long id) {
        petService.getPetByIdAndUser(petId, userId);
        return getConsultationOfPet(id, petId);
    }

    @Transactional(readOnly = true)
    public List<Consultation> getConsultations(Long userId, Long petId, ConsultationStatus status) {
        petService.getPetByIdAndUser(petId, userId);
        if (status != null) {
            return consultationRepository.findByPetIdAndStatus(petId, status);
        }
        return consultationRepository.findByPetId(petId);
    }

    public Consultation updateConsultation(Long userId, Long petId, Long id, Consultation details) {
        petService.getPetByIdAndUser(petId, userId);
        Consultation consultation = getConsultationOfPet(id, petId);

        validateStatusTransition(consultation.getStatus(), details.getStatus());

        consultation.setDate(details.getDate());
        consultation.setVeterinarian(details.getVeterinarian());
        consultation.setReason(details.getReason());
        consultation.setNotes(details.getNotes());
        if (details.getStatus() != null) {
            consultation.setStatus(details.getStatus());
        }
        return consultationRepository.save(consultation);
    }

    public void deleteConsultation(Long userId, Long petId, Long id) {
        petService.getPetByIdAndUser(petId, userId);
        Consultation consultation = getConsultationOfPet(id, petId);
        consultationRepository.delete(consultation);
    }

    /**
     * Valida a transição de status conforme REQ-004.
     * @throws IllegalArgumentException quando a transição é proibida (mapeado para HTTP 400).
     */
    private void validateStatusTransition(ConsultationStatus current, ConsultationStatus next) {
        if (current == ConsultationStatus.CANCELLED) {
            throw new IllegalArgumentException("Consulta cancelada não pode ser alterada");
        }
        if (current == ConsultationStatus.COMPLETED && next == ConsultationStatus.SCHEDULED) {
            throw new IllegalArgumentException("Consulta realizada não pode voltar para agendada");
        }
    }

    private Consultation getConsultationOfPet(Long id, Long petId) {
        if (!consultationRepository.existsByIdAndPetId(id, petId)) {
            throw new EntityNotFoundException("Consulta não encontrada para o pet: " + id);
        }
        return consultationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Consulta não encontrada: " + id));
    }
}
