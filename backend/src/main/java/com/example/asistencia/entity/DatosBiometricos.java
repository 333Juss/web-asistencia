package com.example.asistencia.entity;
import com.example.asistencia.entity.base.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

@Entity
@Table(name = "datos_biometricos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatosBiometricos extends BaseEntity {

    @NotNull(message = "El colaborador es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "colaborador_id", nullable = false)
    private Colaborador colaborador;

    @NotBlank(message = "La ruta de imagen es obligatoria")
    @Column(name = "imagen_path", nullable = false, length = 500)
    private String imagenPath;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    // Almacena el vector de características faciales como JSON
    @Column(columnDefinition = "TEXT")
    private String embeddings;

    @Column(name = "calidad_imagen")
    private Double calidadImagen;

    @NotNull(message = "La fecha de captura es obligatoria")
    @Column(name = "fecha_captura", nullable = false)
    private LocalDateTime fechaCaptura;

    @Column(name = "es_principal", nullable = false)
    @Builder.Default
    private Boolean esPrincipal = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (fechaCaptura == null) {
            fechaCaptura = LocalDateTime.now();
        }
    }
}