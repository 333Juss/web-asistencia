package com.example.asistencia.entity;
import com.example.asistencia.entity.base.BaseEntity;
import com.example.asistencia.entity.enums.AccionAuditoria;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "auditoria", indexes = {
        @Index(name = "idx_usuario", columnList = "usuario_id"),
        @Index(name = "idx_entidad", columnList = "entidad, entidad_id"),
        @Index(name = "idx_accion", columnList = "accion")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auditoria extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @NotBlank(message = "La entidad es obligatoria")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String entidad;

    @Column(name = "entidad_id")
    private Long entidadId;

    @NotNull(message = "La acción es obligatoria")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccionAuditoria accion;

    @Column(name = "datos_anteriores", columnDefinition = "TEXT")
    private String datosAnteriores;

    @Column(name = "datos_nuevos", columnDefinition = "TEXT")
    private String datosNuevos;

    @Size(max = 50)
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Size(max = 500)
    @Column(name = "user_agent", length = 500)
    private String userAgent;
}