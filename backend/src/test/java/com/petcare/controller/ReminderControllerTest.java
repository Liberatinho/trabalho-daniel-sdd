package com.petcare.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petcare.exception.GlobalExceptionHandler;
import com.petcare.model.Reminder;
import com.petcare.model.ReminderType;
import com.petcare.service.ReminderService;
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

@WebMvcTest(ReminderController.class)
@Import(GlobalExceptionHandler.class)
class ReminderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReminderService reminderService;

    @Autowired
    private ObjectMapper objectMapper;

    private Reminder reminder;

    @BeforeEach
    void setUp() {
        reminder = new Reminder(ReminderType.MEDICATION, "Vermífugo", LocalDate.of(2026, 2, 1), null);
        reminder.setId(100L);
        reminder.setCompleted(false);
    }

    @Test
    void createReminder_Success() throws Exception {
        when(reminderService.createReminder(eq(1L), eq(10L), any(Reminder.class))).thenReturn(reminder);

        mockMvc.perform(post("/api/users/1/pets/10/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reminder)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.description").value("Vermífugo"))
                .andExpect(jsonPath("$.type").value("MEDICATION"));
    }

    @Test
    void getReminders_WithFilters_Success() throws Exception {
        when(reminderService.getReminders(1L, 10L, ReminderType.MEDICATION, false))
                .thenReturn(Arrays.asList(reminder));

        mockMvc.perform(get("/api/users/1/pets/10/reminders?type=MEDICATION&completed=false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        verify(reminderService, times(1)).getReminders(1L, 10L, ReminderType.MEDICATION, false);
    }

    @Test
    void getReminders_NoFilter_Success() throws Exception {
        when(reminderService.getReminders(1L, 10L, null, null))
                .thenReturn(Arrays.asList(reminder));

        mockMvc.perform(get("/api/users/1/pets/10/reminders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void getReminder_NotFound_Returns404() throws Exception {
        when(reminderService.getReminder(1L, 10L, 999L))
                .thenThrow(new EntityNotFoundException("Lembrete não encontrado para o pet: 999"));

        mockMvc.perform(get("/api/users/1/pets/10/reminders/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteReminder_Success() throws Exception {
        doNothing().when(reminderService).deleteReminder(1L, 10L, 100L);

        mockMvc.perform(delete("/api/users/1/pets/10/reminders/100"))
                .andExpect(status().isNoContent());

        verify(reminderService, times(1)).deleteReminder(1L, 10L, 100L);
    }
}
