package com.example.asistencia.entity;
import com.example.asistencia.entity.base.BaseEntity;
import com.example.asistencia.entity.enums.EstadoAsistencia;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "asistencias", indexes = {
        @Index(name = "idx_colaborador_fecha", columnList = "colaborador_id, fecha"),
        @Index(name = "idx_sede_fecha", columnList = "sede_id, fecha")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asistencia extends BaseEntity {

    @NotNull(message = "El colaborador es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colaborador_id", nullable = false)
    private Colaborador colaborador;

    @NotNull(message = "La sede es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    @NotNull(message = "La fecha es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_entrada")
    private LocalTime horaEntrada;

    @Column(name = "hora_salida")
    private LocalTime horaSalida;

    @Column(name = "latitud_entrada")
    private Double latitudEntrada;

    @Column(name = "longitud_entrada")
    private Double longitudEntrada;

    @Column(name = "latitud_salida")
    private Double latitudSalida;

    @Column(name = "longitud_salida")
    private Double longitudSalida;

    @Column(name = "confianza_facial_entrada")
    private Double confianzaFacialEntrada;

    @Column(name = "confianza_facial_salida")
    private Double confianzaFacialSalida;

    @Column(name = "imagen_entrada_path", length = 500)
    private String imagenEntradaPath;

    @Column(name = "imagen_salida_path", length = 500)
    private String imagenSalidaPath;

    @Column(name = "horas_trabajadas")
    private Double horasTrabajadas;

    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoAsistencia estado = EstadoAsistencia.INCOMPLETA;

    @Column(columnDefinition = "TEXT")
    private String observaciones;
}