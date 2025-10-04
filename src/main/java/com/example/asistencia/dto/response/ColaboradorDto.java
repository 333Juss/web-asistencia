package com.example.asistencia.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ColaboradorDto {
    private Long id;
    private Long empresaId;
    private Long sedeId;
    private String dni;
    private String nombres;        // Plural, como en tu frontend
    private String apellidos;      // Plural, como en tu frontend
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
    private LocalDate fechaIngreso;
    private String cargo;
    private Boolean tieneDatosBiometricos;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Campo calculado
    private String nombreCompleto;
}