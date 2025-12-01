package com.example.asistencia.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardDto {
    private long totalColaboradores;
    private long asistenciasCount;
    private long tardanzasCount;
    private long ausenciasCount;
    private Map<String, Long> asistenciaPorEstado;
    private Map<String, Long> asistenciaPorDia;
}
