package com.example.asistencia.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SedeDto {
    private Long id;
    private String codigo;
    private String nombre;
    private String direccion;
    private String distrito;
    private String provincia;
    private String departamento;
    private Double latitud;
    private Double longitud;
    private Integer radioMetros;
    private Boolean activo;
}
