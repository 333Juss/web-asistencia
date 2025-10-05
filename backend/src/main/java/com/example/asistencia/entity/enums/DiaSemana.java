package com.example.asistencia.entity.enums;

public enum DiaSemana {
    LUNES(1, "Lunes"),
    MARTES(2, "Martes"),
    MIERCOLES(3, "Miércoles"),
    JUEVES(4, "Jueves"),
    VIERNES(5, "Viernes"),
    SABADO(6, "Sábado"),
    DOMINGO(7, "Domingo");

    private final int valor;
    private final String displayName;

    DiaSemana(int valor, String displayName) {
        this.valor = valor;
        this.displayName = displayName;
    }

    public int getValor() {
        return valor;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static DiaSemana fromValor(int valor) {
        for (DiaSemana dia : DiaSemana.values()) {
            if (dia.valor == valor) {
                return dia;
            }
        }
        throw new IllegalArgumentException("Día de semana inválido: " + valor);
    }
}