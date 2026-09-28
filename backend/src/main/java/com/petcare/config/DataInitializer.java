package com.petcare.config;

import com.petcare.model.*;
import com.petcare.repository.UserRepository;
import com.petcare.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Carga de dados de exemplo na inicialização (REQ-006 / TASK-019).
 * Permite demonstrar a API imediatamente, sem cadastro manual.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PetService petService;
    private final VaccineService vaccineService;
    private final ConsultationService consultationService;
    private final ReminderService reminderService;

    public DataInitializer(UserRepository userRepository,
                           UserService userService,
                           PetService petService,
                           VaccineService vaccineService,
                           ConsultationService consultationService,
                           ReminderService reminderService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.petService = petService;
        this.vaccineService = vaccineService;
        this.consultationService = consultationService;
        this.reminderService = reminderService;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User maria = userService.createUser(new User("Maria Silva", "maria@email.com", "senha123"));
        User joao = userService.createUser(new User("João Santos", "joao@email.com", "senha456"));

        Pet rex = petService.createPet(pet("Rex", "Cão", "Labrador", LocalDate.of(2020, 3, 12), "Muito dócil"), maria.getId());
        Pet mimi = petService.createPet(pet("Mimi", "Gato", "Siamês", LocalDate.of(2022, 8, 5), "Alergia a frango"), maria.getId());
        Pet thor = petService.createPet(pet("Thor", "Cão", "Pastor Alemão", LocalDate.of(2019, 11, 20), null), joao.getId());

        Vaccine v10 = new Vaccine("V10", LocalDate.of(2026, 1, 10), rex);
        v10.setNextDoseDate(LocalDate.of(2026, 7, 10));
        vaccineService.createVaccine(maria.getId(), rex.getId(), v10);

        Vaccine antirrabica = new Vaccine("Antirrábica", LocalDate.of(2026, 2, 1), mimi);
        antirrabica.setNextDoseDate(LocalDate.of(2027, 2, 1));
        vaccineService.createVaccine(maria.getId(), mimi.getId(), antirrabica);

        Vaccine giardia = new Vaccine("Giárdia", LocalDate.of(2026, 3, 15), thor);
        vaccineService.createVaccine(joao.getId(), thor.getId(), giardia);

        Consultation checkup = new Consultation(
                LocalDateTime.of(2026, 9, 25, 10, 0), "Dra. Ana Costa", "Check-up anual", rex);
        checkup.setStatus(ConsultationStatus.SCHEDULED);
        consultationService.createConsultation(maria.getId(), rex.getId(), checkup);

        Consultation retorno = new Consultation(
                LocalDateTime.of(2026, 8, 10, 14, 30), "Dr. Paulo Lima", "Retorno de cirurgia", mimi);
        retorno.setStatus(ConsultationStatus.COMPLETED);
        retorno.setNotes("Recuperação dentro do esperado");
        consultationService.createConsultation(maria.getId(), mimi.getId(), retorno);

        Consultation cancelada = new Consultation(
                LocalDateTime.of(2026, 9, 5, 9, 0), "Dra. Ana Costa", "Vacinação", thor);
        cancelada.setStatus(ConsultationStatus.CANCELLED);
        cancelada.setNotes("Tutor reagendou");
        consultationService.createConsultation(joao.getId(), thor.getId(), cancelada);

        Reminder vermifugo = new Reminder(ReminderType.MEDICATION, "Vermífugo trimestral", LocalDate.of(2026, 10, 1), rex);
        reminderService.createReminder(maria.getId(), rex.getId(), vermifugo);

        Reminder vacina = new Reminder(ReminderType.VACCINE, "Reforço da V10", LocalDate.of(2026, 7, 10), rex);
        reminderService.createReminder(maria.getId(), rex.getId(), vacina);

        Reminder consulta = new Reminder(ReminderType.CONSULTATION, "Retorno pós-cirurgia", LocalDate.of(2026, 9, 30), mimi);
        consulta.setCompleted(true);
        reminderService.createReminder(maria.getId(), mimi.getId(), consulta);
    }

    private Pet pet(String name, String species, String breed, LocalDate birthDate, String notes) {
        Pet pet = new Pet();
        pet.setName(name);
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setBirthDate(birthDate);
        pet.setNotes(notes);
        return pet;
    }
}
