package com.example.asistencia.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SedeUpdateDto {

    private Long id;
    @NotNull(message = "El ID de la empresa es obligatorio")
    private Long empresaId;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;

    @Size(max = 255, message = "La dirección no puede exceder 255 caracteres")
    private String direccion;

    @Size(max = 100, message = "El distrito no puede exceder 100 caracteres")
    private String distrito;

    @Size(max = 100, message = "La provincia no puede exceder 100 caracteres")
    private String provincia;

    @Size(max = 100, message = "El departamento no puede exceder 100 caracteres")
    private String departamento;

    @DecimalMin(value = "-90.0", message = "La latitud debe estar entre -90 y 90")
    @DecimalMax(value = "90.0", message = "La latitud debe estar entre -90 y 90")
    private Double latitud;

    @DecimalMin(value = "-180.0", message = "La longitud debe estar entre -180 y 180")
    @DecimalMax(value = "180.0", message = "La longitud debe estar entre -180 y 180")
    private Double longitud;

    @NotNull(message = "El radio en metros es obligatorio")
    @Min(value = 20, message = "El radio mínimo es 20 metros")
    @Max(value = 200, message = "El radio máximo es 200 metros")
    private Integer radioMetros;
    private Boolean activo;
}