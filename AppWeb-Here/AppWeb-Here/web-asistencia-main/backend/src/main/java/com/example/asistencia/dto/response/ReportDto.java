package com.example.asistencia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportDto {
    private Long colaboradorId;
    private String nombreColaborador;
    private String nombreSede;
    private int diasTrabajados;
    private double totalHorasTrabajadas;
    private int llegadasTarde; // Opcional, si implementamos lógica de tardanza
    private int faltas; // Opcional
}
