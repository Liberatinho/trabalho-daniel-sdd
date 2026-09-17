package com.petcare.service;

import com.petcare.model.User;
import com.petcare.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("João Silva", "joao@email.com", "senha123");
        testUser.setId(1L);
    }

    @Test
    void createUser_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.createUser(testUser);

        assertNotNull(result);
        assertEquals("João Silva", result.getName());
        assertEquals("joao@email.com", result.getEmail());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void createUser_EmailAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail("joao@email.com")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.createUser(testUser);
        });

        assertEquals("Email já cadastrado: joao@email.com", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("João Silva", result.getName());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            userService.getUserById(99L);
        });

        assertEquals("Usuário não encontrado: 99", exception.getMessage());
    }

    @Test
    void getUserByEmail_Success() {
        when(userRepository.findByEmail("joao@email.com")).thenReturn(Optional.of(testUser));

        User result = userService.getUserByEmail("joao@email.com");

        assertNotNull(result);
        assertEquals("joao@email.com", result.getEmail());
    }

    @Test
    void getUserByEmail_NotFound_ThrowsException() {
        when(userRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            userService.getUserByEmail("naoexiste@email.com");
        });

        assertEquals("Usuário não encontrado: naoexiste@email.com", exception.getMessage());
    }

    @Test
    void getAllUsers_Success() {
        User user2 = new User("Maria Santos", "maria@email.com", "senha456");
        user2.setId(2L);

        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser, user2));

        List<User> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(2, result.size());
    }

    @Test
    void updateUser_Success() {
        User updatedData = new User("João Silva Atualizado", "joao@email.com", "novaSenha");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.updateUser(1L, updatedData);

        assertNotNull(result);
        assertEquals("João Silva Atualizado", result.getName());
        assertEquals("novaSenha", result.getPassword());
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        doNothing().when(userRepository).delete(testUser);

        assertDoesNotThrow(() -> userService.deleteUser(1L));
        verify(userRepository, times(1)).delete(testUser);
    }
}
