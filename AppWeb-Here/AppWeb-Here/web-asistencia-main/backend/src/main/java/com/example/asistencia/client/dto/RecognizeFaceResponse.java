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
public class RecognizeFaceResponse {

    @JsonProperty("success")
    private boolean success;

    @JsonProperty("confidence")
    private double confidence;

    @JsonProperty("message")
    private String message;

    @JsonProperty("match")
    private boolean match;
}
