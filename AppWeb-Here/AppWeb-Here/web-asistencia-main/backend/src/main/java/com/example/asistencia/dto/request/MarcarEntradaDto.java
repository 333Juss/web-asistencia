package com.example.asistencia.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarcarEntradaDto {

    @NotNull(message = "El ID del colaborador es obligatorio")
    private Long colaboradorId;

    @NotNull(message = "El ID de la sede es obligatorio")
    private Long sedeId;

    @NotNull(message = "La latitud es obligatoria")
    private Double latitud;

    @NotNull(message = "La longitud es obligatoria")
    private Double longitud;

    @NotBlank(message = "La imagen facial es obligatoria")
    private String imagenFacial;

    private String fecha;

    private String horaEntrada;

    private Double confianzaFacial;
}
