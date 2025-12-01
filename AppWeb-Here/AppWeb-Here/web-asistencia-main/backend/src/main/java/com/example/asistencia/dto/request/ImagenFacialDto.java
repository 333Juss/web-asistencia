package com.example.asistencia.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenFacialDto {

    @NotBlank(message = "La imagen es obligatoria")
    private String imagenBase64;
}
