package com.example.asistencia.entity;

import com.example.asistencia.entity.enums.EstadoJustificacion;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "justificaciones")
@Getter @Setter
public class Justificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "asistencia_id", unique = true)
    private Asistencia asistencia;


    @ManyToOne
    @JoinColumn(name = "colaborador_id", nullable = false)
    private Colaborador colaborador;

    @Column(nullable = false)
    private String motivo;

    @Enumerated(EnumType.STRING)
    private EstadoJustificacion estado; // PENDIENTE, APROBADA, RECHAZADA

    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaRespuesta;
    private String respuestaSupervisor;
    @Column(name = "archivo_sustento")
    private String archivoSustento; // ruta del archivo
}
