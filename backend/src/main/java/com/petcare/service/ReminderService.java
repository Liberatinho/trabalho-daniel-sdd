package com.petcare.service;

import com.petcare.model.Pet;
import com.petcare.model.Reminder;
import com.petcare.model.ReminderType;
import com.petcare.repository.ReminderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Regras de negócio de Lembretes (REQ-005).
 * - Ownership: o lembrete pertence a um pet do usuário autenticado.
 * - Lembretes podem ser filtrados por tipo e/ou por status de conclusão.
 * - completed é opcional (padrão: false).
 */
@Service
@Transactional
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final PetService petService;

    public ReminderService(ReminderRepository reminderRepository, PetService petService) {
        this.reminderRepository = reminderRepository;
        this.petService = petService;
    }

    public Reminder createReminder(Long userId, Long petId, Reminder reminder) {
        Pet pet = petService.getPetByIdAndUser(petId, userId);
        reminder.setPet(pet);
        if (reminder.getCompleted() == null) {
            reminder.setCompleted(false);
        }
        return reminderRepository.save(reminder);
    }

    @Transactional(readOnly = true)
    public Reminder getReminder(Long userId, Long petId, Long id) {
        petService.getPetByIdAndUser(petId, userId);
        return getReminderOfPet(id, petId);
    }

    @Transactional(readOnly = true)
    public List<Reminder> getReminders(Long userId, Long petId, ReminderType type, Boolean completed) {
        petService.getPetByIdAndUser(petId, userId);
        if (type != null && completed != null) {
            return reminderRepository.findByPetIdAndTypeAndCompleted(petId, type, completed);
        }
        if (type != null) {
            return reminderRepository.findByPetIdAndType(petId, type);
        }
        if (completed != null) {
            return reminderRepository.findByPetIdAndCompleted(petId, completed);
        }
        return reminderRepository.findByPetId(petId);
    }

    public Reminder updateReminder(Long userId, Long petId, Long id, Reminder details) {
        petService.getPetByIdAndUser(petId, userId);
        Reminder reminder = getReminderOfPet(id, petId);

        reminder.setType(details.getType());
        reminder.setDescription(details.getDescription());
        reminder.setDueDate(details.getDueDate());
        if (details.getCompleted() != null) {
            reminder.setCompleted(details.getCompleted());
        }
        return reminderRepository.save(reminder);
    }

    public void deleteReminder(Long userId, Long petId, Long id) {
        petService.getPetByIdAndUser(petId, userId);
        Reminder reminder = getReminderOfPet(id, petId);
        reminderRepository.delete(reminder);
    }

    private Reminder getReminderOfPet(Long id, Long petId) {
        if (!reminderRepository.existsByIdAndPetId(id, petId)) {
            throw new EntityNotFoundException("Lembrete não encontrado para o pet: " + id);
        }
        return reminderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lembrete não encontrado: " + id));
    }
}
