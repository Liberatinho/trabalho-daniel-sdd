package com.petcare.controller;

import com.petcare.model.Reminder;
import com.petcare.model.ReminderType;
import com.petcare.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/pets/{petId}/reminders")
public class ReminderController {

    private final ReminderService reminderService;
    private final ObjectMapper objectMapper;

    public ReminderController(ReminderService reminderService, ObjectMapper objectMapper) {
        this.reminderService = reminderService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<Reminder> createReminder(@PathVariable Long userId,
                                                   @PathVariable Long petId,
                                                   @Valid @RequestBody String reminderJson) {
        Reminder reminder = objectMapper.readValue(reminderJson, Reminder.class);
        Reminder created = reminderService.createReminder(userId, petId, reminder);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reminder> getReminder(@PathVariable Long userId,
                                                @PathVariable Long petId,
                                                @PathVariable Long id) {
        Reminder reminder = reminderService.getReminder(userId, petId, id);
        return ResponseEntity.ok(reminder);
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getReminders(@PathVariable Long userId,
                                                       @PathVariable Long petId,
                                                       @RequestBody String remindersJson) {
        List<Reminder> reminders = objectMapper.readValue(remindersJson, List.class);
        return ResponseEntity.ok(reminders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(@PathVariable Long userId,
                                                   @PathVariable Long petId,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody String reminderJson) {
        Reminder reminder = objectMapper.readValue(reminderJson, Reminder.class);
        Reminder updated = reminderService.updateReminder(userId, petId, id, reminder);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable Long userId,
                                               @PathVariable Long petId,
                                               @PathVariable Long id) {
        reminderService.deleteReminder(userId, petId, id);
        return ResponseEntity.noContent().build();
    }
}
