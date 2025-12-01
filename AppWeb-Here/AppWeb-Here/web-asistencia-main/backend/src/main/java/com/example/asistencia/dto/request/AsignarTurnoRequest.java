package com.example.asistencia.dto.request;

public record AsignarTurnoRequest(
        Long turnoId,
        String fechaInicioTurno
) {}
