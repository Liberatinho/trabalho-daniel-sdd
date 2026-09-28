package com.petcare.repository;

import com.petcare.model.Reminder;
import com.petcare.model.ReminderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByPetId(Long petId);
    List<Reminder> findByPetIdAndType(Long petId, ReminderType type);
    List<Reminder> findByPetIdAndCompleted(Long petId, Boolean completed);
    List<Reminder> findByPetIdAndTypeAndCompleted(Long petId, ReminderType type, Boolean completed);
    boolean existsByIdAndPetId(Long id, Long petId);
}
