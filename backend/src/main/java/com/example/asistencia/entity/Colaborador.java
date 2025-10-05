package com.example.asistencia.entity;

import com.example.asistencia.entity.base.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "colaboradores", uniqueConstraints = {
        @UniqueConstraint(columnNames = "dni"),
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Colaborador extends BaseEntity {

    @NotNull(message = "La empresa es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    @JsonIgnoreProperties({"colaboradores", "sedes", "hibernateLazyInitializer", "handler"})
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id")
    @JsonIgnoreProperties({"colaboradores", "empresa", "hibernateLazyInitializer", "handler"})
    private Sede sede;

    @NotBlank(message = "El DNI es obligatorio")
    @Size(min = 8, max = 8, message = "El DNI debe tener 8 dígitos")
    @Column(nullable = false, unique = true, length = 8)
    private String dni;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String apellidos;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no es válido")
    @Size(max = 100)
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Size(max = 20)
    @Column(length = 20)
    private String telefono;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @Size(max = 100)
    @Column(length = 100)
    private String cargo;

    @Column(name = "tiene_datos_biometricos", nullable = false)
    @Builder.Default
    private Boolean tieneDatosBiometricos = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @Transient
    public String getNombreCompleto() {
        return apellidos + ", " + nombres;
    }

    @Transient
    public Integer getEdad() {
        if (fechaNacimiento == null) {
            return null;
        }
        return LocalDate.now().getYear() - fechaNacimiento.getYear();
    }
}
