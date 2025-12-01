package com.example.asistencia.service.impl;

import com.example.asistencia.client.FaceRecognitionClient;
import com.example.asistencia.client.dto.RegisterFaceRequest;
import com.example.asistencia.client.dto.RegisterFaceResponse;
import com.example.asistencia.client.dto.ValidateImageRequest;
import com.example.asistencia.client.dto.ValidateImageResponse;
import com.example.asistencia.dto.request.CapturarRostroDto;
import com.example.asistencia.dto.request.ImagenFacialDto;
import com.example.asistencia.dto.response.RegistroBiometricoResponse;
import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.entity.DatosBiometricos;
import com.example.asistencia.exception.ResourceNotFoundException;
import com.example.asistencia.repository.ColaboradorRepository;
import com.example.asistencia.repository.DatosBiometricosRepository;
import com.example.asistencia.service.BiometriaService;
import com.example.asistencia.service.FileStorageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BiometriaServiceImpl implements BiometriaService {

    private final FaceRecognitionClient faceRecognitionClient;
    private final FileStorageService fileStorageService;
    private final ColaboradorRepository colaboradorRepository;
    private final DatosBiometricosRepository datosBiometricosRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public RegistroBiometricoResponse capturarRostro(CapturarRostroDto dto) {
        log.info("Iniciando registro biométrico para colaborador ID: {}", dto.getColaboradorId());

        // 1. Verificar que el colaborador existe
        Colaborador colaborador = colaboradorRepository.findById(dto.getColaboradorId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Colaborador no encontrado con ID: " + dto.getColaboradorId()
                ));

        // 2. Extraer las imágenes en base64
        List<String> imagenesBase64 = dto.getImagenes().stream()
                .map(ImagenFacialDto::getImagenBase64)
                .collect(Collectors.toList());

        // 3. Enviar al servicio de reconocimiento facial para generar embeddings
        RegisterFaceRequest request = RegisterFaceRequest.builder()
                .colaboradorId(dto.getColaboradorId())
                .images(imagenesBase64)
                .build();

        RegisterFaceResponse response = faceRecognitionClient.registerFaces(request);

        if (!response.isSuccess()) {
            throw new RuntimeException("Error al registrar rostro: " + response.getMessage());
        }

        // 4. Guardar las imágenes y datos biométricos
        List<DatosBiometricos> datosBiometricosList = new ArrayList<>();

        for (int i = 0; i < imagenesBase64.size(); i++) {
            String imagenBase64 = imagenesBase64.get(i);
            List<Double> embedding = response.getEmbeddings().get(i);
            Double qualityScore = response.getQualityScores().get(i);

            // Guardar imagen en el sistema de archivos
            String fileName = fileStorageService.saveBiometricImage(
                    imagenBase64,
                    dto.getColaboradorId()
            );

            // Convertir embedding a JSON
            String embeddingJson;
            try {
                embeddingJson = objectMapper.writeValueAsString(embedding);
            } catch (JsonProcessingException e) {
                log.error("Error al convertir embedding a JSON", e);
                throw new RuntimeException("Error al procesar embedding");
            }

            // Crear entidad DatosBiometricos
            DatosBiometricos datosBiometricos = DatosBiometricos.builder()
                    .colaborador(colaborador)
                    .imagenPath(fileName)
                    .imagenUrl("/uploads/biometric/" + fileName)
                    .embeddings(embeddingJson)
                    .calidadImagen(qualityScore)
                    .fechaCaptura(LocalDateTime.now())
                    .esPrincipal(i == 0) // La primera imagen es la principal
                    .activo(true)
                    .build();

            datosBiometricosList.add(datosBiometricos);
        }

        // 5. Guardar en base de datos
        datosBiometricosRepository.saveAll(datosBiometricosList);

        // 6. Actualizar flag del colaborador
        colaborador.setTieneDatosBiometricos(true);
        colaboradorRepository.save(colaborador);

        log.info("Registro biométrico completado exitosamente para colaborador ID: {}", dto.getColaboradorId());

        return RegistroBiometricoResponse.builder()
                .success(true)
                .message("Registro biométrico completado exitosamente")
                .cantidadImagenes(datosBiometricosList.size())
                .calidadPromedio(response.getQualityScores().stream()
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0.0))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DatosBiometricos> obtenerDatosBiometricos(Long colaboradorId) {
        log.info("Obteniendo datos biométricos para colaborador ID: {}", colaboradorId);
        return datosBiometricosRepository.findByColaboradorIdAndActivoTrue(colaboradorId);
    }

    @Override
    public boolean validarImagen(String imagenBase64) {
        log.info("Validando imagen facial");

        ValidateImageRequest request = ValidateImageRequest.builder()
                .image(imagenBase64)
                .build();

        ValidateImageResponse response = faceRecognitionClient.validateImage(request);

        return response.isValid();
    }

    @Override
    @Transactional
    public void eliminarDatosBiometricos(Long colaboradorId) {
        log.info("Eliminando datos biométricos para colaborador ID: {}", colaboradorId);

        // Obtener colaborador
        Colaborador colaborador = colaboradorRepository.findById(colaboradorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Colaborador no encontrado con ID: " + colaboradorId
                ));

        // Eliminar datos biométricos
        datosBiometricosRepository.deleteByColaboradorId(colaboradorId);

        // Actualizar flag del colaborador
        colaborador.setTieneDatosBiometricos(false);
        colaboradorRepository.save(colaborador);

        log.info("Datos biométricos eliminados exitosamente");
    }

    @Override
    public boolean tieneDatosBiometricos(Long colaboradorId) {
        return datosBiometricosRepository.existsByColaboradorId(colaboradorId);
    }

}
