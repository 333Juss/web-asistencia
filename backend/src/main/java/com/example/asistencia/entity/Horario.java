package com.example.asistencia.entity;
import com.example.asistencia.entity.base.BaseEntity;
import com.example.asistencia.entity.enums.DiaSemana;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "horarios", indexes = {
        @Index(name = "idx_colaborador_dia", columnList = "colaborador_id, dia_semana")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Horario extends BaseEntity {

    @NotNull(message = "El colaborador es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colaborador_id", nullable = false)
    private Colaborador colaborador;

    @NotNull(message = "El día de la semana es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "dia_semana", nullable = false, length = 20)
    private DiaSemana diaSemana;

    @NotNull(message = "La hora de inicio es obligatoria")
    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;
}