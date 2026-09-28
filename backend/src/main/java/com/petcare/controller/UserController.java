package com.petcare.controller;

import com.petcare.model.User;
import com.petcare.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;
    
    public UserController(UserService userService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody String userJson) {
        User user = objectMapper.readValue(userJson, User.class);
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Long userId = Long.parseLong(id);
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        String email = objectMapper.readValue(emailJson, String.class);
        User user = userService.getUserByEmail(emailValue);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<User> getUserByCpf(@PathVariable String cpf) {
        String cpfValue = objectMapper.readValue(cpfJson, String.class);
        User user = userService.getUserByCpf(cpfValue);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(@RequestBody List<User> users) {
        List<User> users = objectMapper.readValue(usersJson, List.class);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @Valid @RequestBody User user) {
        User user = objectMapper.readValue(userJson, User.class);
        User updatedUser = userService.updateUser(userId, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Long userId = Long.parseLong(id);
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
