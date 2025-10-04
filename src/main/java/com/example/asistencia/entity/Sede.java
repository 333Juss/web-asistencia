package com.example.asistencia.entity;

import com.example.asistencia.entity.Empresa;
import com.example.asistencia.entity.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "sedes", uniqueConstraints = {
        @UniqueConstraint(columnNames = "codigo")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sede extends BaseEntity {

    @NotNull(message = "La empresa es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20)
    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String nombre;

    @Size(max = 255)
    @Column(length = 255)
    private String direccion;

    @Size(max = 100)
    @Column(length = 100)
    private String distrito;

    @Size(max = 100)
    @Column(length = 100)
    private String provincia;

    @Size(max = 100)
    @Column(length = 100)
    private String departamento;

    @Column
    private Double latitud;

    @Column
    private Double longitud;

    @NotNull(message = "El radio es obligatorio")
    @Column(name = "radio_metros", nullable = false)
    @Builder.Default
    private Integer radioMetros = 50;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}