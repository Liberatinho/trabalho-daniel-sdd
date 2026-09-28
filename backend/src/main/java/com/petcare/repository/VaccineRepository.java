package com.petcare.repository;

import com.petcare.model.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    List<Vaccine> findByPetId(Long petId);
    boolean existsByIdAndPetId(Long id, Long petId);
}
