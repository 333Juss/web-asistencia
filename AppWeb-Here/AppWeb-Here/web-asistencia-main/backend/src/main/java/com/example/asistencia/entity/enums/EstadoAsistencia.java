package com.example.asistencia.entity.enums;

public enum EstadoAsistencia {

    COMPLETA("Completa"),
    INCOMPLETA("Incompleta"),
    TARDANZA("Tardanza"),

    // Faltó al trabajo
    FALTA("Falta"),

    // Envío de justificación
    PENDIENTE_JUSTIFICACION("Pendiente de Justificación"),

    // Supervisor aprueba justificación
    JUSTIFICADA("Justificada"),

    // Supervisor rechaza la justificación
    RECHAZADA("Rechazada");

    private final String displayName;

    EstadoAsistencia(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
