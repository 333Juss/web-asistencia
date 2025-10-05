package com.example.asistencia.entity;
import com.example.asistencia.entity.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "empresas", uniqueConstraints = {
        @UniqueConstraint(columnNames = "ruc")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empresa extends BaseEntity {

    @NotBlank(message = "El RUC es obligatorio")
    @Size(min = 11, max = 11, message = "El RUC debe tener 11 dígitos")
    @Column(nullable = false, unique = true, length = 11)
    private String ruc;

    @NotBlank(message = "La razón social es obligatoria")
    @Size(max = 200)
    @Column(name = "razon_social", nullable = false, length = 200)
    private String razonSocial;

    @Size(max = 200)
    @Column(name = "nombre_comercial", length = 200)
    private String nombreComercial;

    @Size(max = 255)
    @Column(length = 255)
    private String direccion;

    @Size(max = 100)
    @Column(length = 100)
    private String ciudad;

    @Size(max = 100)
    @Column(length = 100)
    private String departamento;

    @Size(max = 10)
    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @Size(max = 20)
    @Column(length = 20)
    private String telefono;

    @Size(max = 100)
    @Column(length = 100)
    private String categoria;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "cantidad_empleados")
    private Integer cantidadEmpleados;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}