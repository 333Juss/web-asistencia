package com.example.asistencia.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmpresaUpdateDto {

    @NotNull(message = "El ID es obligatorio")
    private Long id;

    @Size(max = 200, message = "La razón social no puede exceder 200 caracteres")
    private String razonSocial;

    @Size(max = 200, message = "El nombre comercial no puede exceder 200 caracteres")
    private String nombreComercial;

    @Size(max = 255, message = "La dirección no puede exceder 255 caracteres")
    private String direccion;

    @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
    private String ciudad;

    @Size(max = 100, message = "El departamento no puede exceder 100 caracteres")
    private String departamento;

    @Size(max = 10, message = "El código postal no puede exceder 10 caracteres")
    private String codigoPostal;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;

    @Size(max = 100, message = "La categoría no puede exceder 100 caracteres")
    private String categoria;

    private String descripcion;

    private Integer cantidadEmpleados;

    private Boolean activo;
}