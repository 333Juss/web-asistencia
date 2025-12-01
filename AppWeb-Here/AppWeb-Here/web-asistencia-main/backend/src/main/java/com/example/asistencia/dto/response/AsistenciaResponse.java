package com.example.asistencia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaResponse {
    private Long id;
    private Long colaboradorId;
    private String nombreColaborador;
    private Long sedeId;
    private String nombreSede;
    private LocalDate fecha;
    private LocalTime horaEntrada;
    private LocalTime horaSalida;
    private Double horasTrabajadas;
    private String estado;
    private Double confianzaEntrada;
    private Double confianzaSalida;
}
