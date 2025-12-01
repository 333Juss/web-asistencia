package com.example.asistencia.dto;

import com.example.asistencia.entity.enums.EstadoAsistencia;
import com.example.asistencia.entity.enums.EstadoJustificacion;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class InasistenciaDTO {
    private Long asistenciaId;
    private LocalDate fecha;
    private String turno;
    private EstadoAsistencia estadoAsistencia;
    private EstadoJustificacion estadoJustificacion; // puede ser null
    private Long justificacionId; // puede ser null
}
