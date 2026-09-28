package com.petcare.model;

/**
 * Estados possíveis de uma consulta veterinária (REQ-004).
 * SCHEDULED  -> consulta agendada (estado inicial padrão)
 * COMPLETED  -> consulta realizada
 * CANCELLED  -> consulta cancelada (estado terminal)
 */
public enum ConsultationStatus {
    SCHEDULED,
    COMPLETED,
    CANCELLED
}
