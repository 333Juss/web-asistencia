package com.example.asistencia.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ColaboradorCreateDto {
    private Long empresaId;
    private Long sedeId;
    private String dni;
    private String nombres;
    private String apellidos;
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
    private LocalDate fechaIngreso;
    private String cargo;

    // Campos para crear usuario
    @Builder.Default
    private Boolean crearUsuario = false;
    private String username;  // Username asignado por el admin
    private String passwordTemporal;  // Password temporal asignado por el admin
}