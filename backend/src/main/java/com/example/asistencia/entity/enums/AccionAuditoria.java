package com.example.asistencia.entity.enums;

public enum AccionAuditoria {
    CREATE("Crear"),
    UPDATE("Actualizar"),
    DELETE("Eliminar"),
    LOGIN("Iniciar Sesión"),
    LOGOUT("Cerrar Sesión");

    private final String displayName;

    AccionAuditoria(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}