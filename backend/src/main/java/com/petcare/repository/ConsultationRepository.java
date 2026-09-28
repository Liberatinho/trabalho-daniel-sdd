package com.petcare.repository;

import com.petcare.model.Consultation;
import com.petcare.model.ConsultationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPetId(Long petId);
    List<Consultation> findByPetIdAndStatus(Long petId, ConsultationStatus status);
    boolean existsByIdAndPetId(Long id, Long petId);
}
