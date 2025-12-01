package com.example.asistencia.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterFaceRequest {

    @JsonProperty("colaborador_id")
    private Long colaboradorId;

    @JsonProperty("images")
    private List<String> images;
}
