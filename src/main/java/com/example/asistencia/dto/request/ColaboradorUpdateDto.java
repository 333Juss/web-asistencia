package com.example.asistencia.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ColaboradorUpdateDto {

    private Long id;
    @NotNull(message = "El ID de la empresa es obligatorio")
    private Long empresaId;

    private Long sedeId;

    @NotBlank(message = "El DNI es obligatorio")
    @Size(min = 8, max = 8, message = "El DNI debe tener 8 dígitos")
    @Pattern(regexp = "\\d{8}", message = "El DNI debe contener solo números")
    private String dni;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100, message = "Los nombres no pueden exceder 100 caracteres")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100, message = "Los apellidos no pueden exceder 100 caracteres")
    private String apellidos;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no es válido")
    @Size(max = 100, message = "El email no puede exceder 100 caracteres")
    private String email;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;

    @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
    private LocalDate fechaNacimiento;

    @PastOrPresent(message = "La fecha de ingreso no puede ser futura")
    private LocalDate fechaIngreso;

    @Size(max = 100, message = "El cargo no puede exceder 100 caracteres")
    private String cargo;
    private Boolean activo;
}