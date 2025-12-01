package com.example.asistencia.service.impl;

import com.example.asistencia.client.FaceRecognitionClient;
import com.example.asistencia.client.dto.RecognizeFaceRequest;
import com.example.asistencia.client.dto.RecognizeFaceResponse;
import com.example.asistencia.entity.DatosBiometricos;
import com.example.asistencia.exception.FacialRecognitionException;
import com.example.asistencia.exception.ResourceNotFoundException;
import com.example.asistencia.repository.DatosBiometricosRepository;
import com.example.asistencia.service.ReconocimientoFacialService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReconocimientoFacialServiceImpl implements ReconocimientoFacialService {

    private final FaceRecognitionClient faceRecognitionClient;
    private final DatosBiometricosRepository datosBiometricosRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public double reconocerRostro(Long colaboradorId, String imagenBase64) {
        log.info("Reconociendo rostro para colaborador ID: {}", colaboradorId);

        // 1. Obtener datos biométricos del colaborador
        List<DatosBiometricos> datosBiometricos = datosBiometricosRepository
                .findByColaboradorIdAndActivoTrue(colaboradorId);

        if (datosBiometricos.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No se encontraron datos biométricos para el colaborador ID: " + colaboradorId +
                            ". Debe registrar su rostro primero."
            );
        }

        // 2. Extraer embeddings almacenados
        List<List<Double>> storedEmbeddings = datosBiometricos.stream()
                .map(db -> {
                    try {
                        return objectMapper.readValue(
                                db.getEmbeddings(),
                                new TypeReference<List<Double>>() {}
                        );
                    } catch (Exception e) {
                        log.error("Error al parsear embeddings", e);
                        return null;
                    }
                })
                .filter(embedding -> embedding != null)
                .collect(Collectors.toList());

        if (storedEmbeddings.isEmpty()) {
            throw new FacialRecognitionException(
                    "Error al procesar datos biométricos almacenados"
            );
        }

        // 3. Llamar al servicio de reconocimiento facial
        RecognizeFaceRequest request = RecognizeFaceRequest.builder()
                .image(imagenBase64)
                .storedEmbeddings(storedEmbeddings)
                .build();

        RecognizeFaceResponse response = faceRecognitionClient.recognizeFace(request);

        if (!response.isSuccess()) {
            throw new FacialRecognitionException(
                    "Error en reconocimiento facial: " + response.getMessage()
            );
        }

        log.info("Reconocimiento facial completado. Confianza: {}", response.getConfidence());

        return response.getConfidence();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verificarRostro(Long colaboradorId, String imagenBase64, double threshold) {
        log.info("Verificando rostro para colaborador ID: {} con threshold: {}", colaboradorId, threshold);

        double confidence = reconocerRostro(colaboradorId, imagenBase64);

        boolean match = confidence >= threshold;

        log.info("Resultado de verificación: {} (confianza: {}, threshold: {})",
                match ? "COINCIDE" : "NO COINCIDE", confidence, threshold);

        return match;
    }
}
