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
public class RecognizeFaceRequest {

    @JsonProperty("image")
    private String image;

    @JsonProperty("stored_embeddings")
    private List<List<Double>> storedEmbeddings;
}
