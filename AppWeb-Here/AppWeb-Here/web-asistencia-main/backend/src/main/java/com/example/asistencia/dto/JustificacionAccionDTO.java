package com.example.asistencia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor

public class JustificacionAccionDTO {
    private Long id;
    private String estado;
    private LocalDateTime fechaRespuesta;
    private String respuestaSupervisor;
}
