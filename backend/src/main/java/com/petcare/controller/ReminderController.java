package com.petcare.controller;

import com.petcare.model.Reminder;
import com.petcare.model.ReminderType;
import com.petcare.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/pets/{petId}/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @PostMapping
    public ResponseEntity<Reminder> createReminder(@PathVariable Long userId,
                                                   @PathVariable Long petId,
                                                   @Valid @RequestBody Reminder reminder) {
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
                                                       @RequestParam(required = false) ReminderType type,
                                                       @RequestParam(required = false) Boolean completed) {
        List<Reminder> reminders = reminderService.getReminders(userId, petId, type, completed);
        return ResponseEntity.ok(reminders);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(@PathVariable Long userId,
                                                   @PathVariable Long petId,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody Reminder reminder) {
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
