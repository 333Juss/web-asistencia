package com.example.asistencia.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidateImageResponse {

    @JsonProperty("valid")
    private boolean valid;

    @JsonProperty("message")
    private String message;

    @JsonProperty("faces_count")
    private int facesCount;
}
