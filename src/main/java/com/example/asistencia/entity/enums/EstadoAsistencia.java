package com.example.asistencia.entity.enums;

public enum EstadoAsistencia {
    COMPLETA("Completa"),
    INCOMPLETA("Incompleta"),
    TARDANZA("Tardanza"),
    FALTA("Falta");

    private final String displayName;

    EstadoAsistencia(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}