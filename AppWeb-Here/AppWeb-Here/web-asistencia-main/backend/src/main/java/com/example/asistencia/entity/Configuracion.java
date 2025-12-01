package com.example.asistencia.entity;

import com.example.asistencia.entity.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "configuracion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Configuracion extends BaseEntity {

    @Column(name = "nombre_empresa", nullable = false)
    private String nombreEmpresa;

    @Column(name = "ruc", length = 11)
    private String ruc;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "hora_entrada_default")
    private LocalTime horaEntradaDefault;

    @Column(name = "hora_salida_default")
    private LocalTime horaSalidaDefault;

    @Column(name = "tolerancia_minutos")
    private Integer toleranciaMinutos;

    @Column(name = "nivel_confianza_biometrica")
    private Double nivelConfianzaBiometrica;
}
