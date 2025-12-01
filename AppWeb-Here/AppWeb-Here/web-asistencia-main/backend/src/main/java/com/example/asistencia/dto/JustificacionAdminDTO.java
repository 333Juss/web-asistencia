package com.example.asistencia.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class JustificacionAdminDTO {

    private Long id;

    private Long colaboradorId;
    private String nombres;
    private String apellidos;

    private Long asistenciaId;
    private LocalDate fechaFalta;

    private String motivo;
    private String estado;

    private LocalDateTime fechaSolicitud;
    private String archivoSustento;
}
