package com.example.asistencia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroBiometricoResponse {

    private boolean success;
    private String message;
    private int cantidadImagenes;
    private double calidadPromedio;
}
