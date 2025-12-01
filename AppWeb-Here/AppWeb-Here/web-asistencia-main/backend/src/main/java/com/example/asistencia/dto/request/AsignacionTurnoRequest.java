package com.example.asistencia.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AsignacionTurnoRequest {
    private List<Long> colaboradorIds;
    private Long turnoId;
    private LocalDate fechaInicioTurno;
}
