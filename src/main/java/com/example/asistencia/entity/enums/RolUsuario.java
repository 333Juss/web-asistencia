package com.example.asistencia.entity.enums;

public enum RolUsuario {
    ADMIN("Administrador"),
    RRHH("Recursos Humanos"),
    EMPLEADO("Empleado"),
    SUPERVISOR("Supervisor");

    private final String displayName;

    RolUsuario(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}