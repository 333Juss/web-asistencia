package com.example.asistencia.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CapturarRostroDto {

    @NotNull(message = "El ID del colaborador es obligatorio")
    private Long colaboradorId;

    @NotEmpty(message = "Debe proporcionar al menos una imagen")
    @Size(min = 1, max = 5, message = "Debe proporcionar entre 1 y 5 imágenes")
    @Valid
    private List<ImagenFacialDto> imagenes;
}
