package com.petcare.service;

import com.petcare.model.Pet;
import com.petcare.model.Reminder;
import com.petcare.model.ReminderType;
import com.petcare.model.User;
import com.petcare.repository.ReminderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReminderServiceTest {

    @Mock
    private ReminderRepository reminderRepository;

    @Mock
    private PetService petService;

    @InjectMocks
    private ReminderService reminderService;

    private Pet pet;
    private Reminder reminder;

    @BeforeEach
    void setUp() {
        User user = new User("Maria", "maria@email.com", "senha");
        user.setId(1L);
        pet = new Pet("Rex", "Cão", user);
        pet.setId(10L);

        reminder = new Reminder(ReminderType.MEDICATION, "Vermífugo", LocalDate.of(2026, 2, 1), pet);
        reminder.setId(100L);
        reminder.setCompleted(false);
    }

    @Test
    void createReminder_Success_DefaultsCompletedFalse() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(reminderRepository.save(any(Reminder.class))).thenAnswer(inv -> inv.getArgument(0));

        Reminder input = new Reminder(ReminderType.OTHER, "Banho", LocalDate.of(2026, 2, 1), null);
        input.setCompleted(null); // não informado

        Reminder result = reminderService.createReminder(1L, 10L, input);

        assertNotNull(result);
        assertEquals(pet, input.getPet());
        assertEquals(Boolean.FALSE, input.getCompleted(), "completed deve assumir false por padrão");
        verify(reminderRepository, times(1)).save(input);
    }

    @Test
    void createReminder_PetNotOwned_ThrowsSecurity() {
        when(petService.getPetByIdAndUser(10L, 1L))
                .thenThrow(new SecurityException("Pet não pertence ao usuário ou não existe"));

        Reminder input = new Reminder(ReminderType.OTHER, "Banho", LocalDate.of(2026, 2, 1), null);

        assertThrows(SecurityException.class,
                () -> reminderService.createReminder(1L, 10L, input));
        verify(reminderRepository, never()).save(any());
    }

    @Test
    void getReminders_FilterByType_UsesTypeQuery() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(reminderRepository.findByPetIdAndType(10L, ReminderType.MEDICATION))
                .thenReturn(Arrays.asList(reminder));

        List<Reminder> result = reminderService.getReminders(1L, 10L, ReminderType.MEDICATION, null);

        assertEquals(1, result.size());
        verify(reminderRepository, times(1)).findByPetIdAndType(10L, ReminderType.MEDICATION);
        verify(reminderRepository, never()).findByPetId(anyLong());
    }

    @Test
    void getReminders_FilterByCompleted_UsesCompletedQuery() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(reminderRepository.findByPetIdAndCompleted(10L, false))
                .thenReturn(Arrays.asList(reminder));

        List<Reminder> result = reminderService.getReminders(1L, 10L, null, false);

        assertEquals(1, result.size());
        verify(reminderRepository, times(1)).findByPetIdAndCompleted(10L, false);
    }

    @Test
    void getReminders_FilterByTypeAndCompleted_UsesCombinedQuery() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(reminderRepository.findByPetIdAndTypeAndCompleted(10L, ReminderType.MEDICATION, false))
                .thenReturn(Arrays.asList(reminder));

        List<Reminder> result = reminderService.getReminders(1L, 10L, ReminderType.MEDICATION, false);

        assertEquals(1, result.size());
        verify(reminderRepository, times(1))
                .findByPetIdAndTypeAndCompleted(10L, ReminderType.MEDICATION, false);
    }

    @Test
    void getReminders_NoFilter_ReturnsAll() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(reminderRepository.findByPetId(10L)).thenReturn(Arrays.asList(reminder));

        List<Reminder> result = reminderService.getReminders(1L, 10L, null, null);

        assertEquals(1, result.size());
        verify(reminderRepository, times(1)).findByPetId(10L);
    }

    @Test
    void getReminder_NotFoundForPet_ThrowsNotFound() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(reminderRepository.existsByIdAndPetId(999L, 10L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class,
                () -> reminderService.getReminder(1L, 10L, 999L));
    }

    @Test
    void deleteReminder_Success() {
        when(petService.getPetByIdAndUser(10L, 1L)).thenReturn(pet);
        when(reminderRepository.existsByIdAndPetId(100L, 10L)).thenReturn(true);
        when(reminderRepository.findById(100L)).thenReturn(Optional.of(reminder));

        assertDoesNotThrow(() -> reminderService.deleteReminder(1L, 10L, 100L));
        verify(reminderRepository, times(1)).delete(reminder);
    }
}
