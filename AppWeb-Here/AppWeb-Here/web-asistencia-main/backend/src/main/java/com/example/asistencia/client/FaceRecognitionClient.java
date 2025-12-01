package com.example.asistencia.client;

import com.example.asistencia.client.dto.RegisterFaceRequest;
import com.example.asistencia.client.dto.RegisterFaceResponse;
import com.example.asistencia.client.dto.RecognizeFaceRequest;
import com.example.asistencia.client.dto.RecognizeFaceResponse;
import com.example.asistencia.client.dto.ValidateImageRequest;
import com.example.asistencia.client.dto.ValidateImageResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * Cliente HTTP para comunicarse con el servicio Python de reconocimiento facial
 */
@Slf4j
@Component
public class FaceRecognitionClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final ObjectMapper objectMapper;

    public FaceRecognitionClient(
            RestTemplate restTemplate,
            ObjectMapper objectMapper,
            @Value("${face-recognition.service.url:http://localhost:5000}") String baseUrl
    ) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.baseUrl = baseUrl;
    }

    /**
     * Registra múltiples imágenes faciales y obtiene embeddings
     */
    public RegisterFaceResponse registerFaces(RegisterFaceRequest request) {
        try {
            log.info("Sending face registration request for colaborador_id: {}", request.getColaboradorId());

            String url = baseUrl + "/api/register";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<RegisterFaceRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<RegisterFaceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    RegisterFaceResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("Face registration successful");
                return response.getBody();
            } else {
                log.error("Face registration failed with status: {}", response.getStatusCode());
                throw new RuntimeException("Face registration failed");
            }

        } catch (Exception e) {
            log.error("Error during face registration: {}", e.getMessage(), e);
            throw new RuntimeException("Error communicating with face recognition service: " + e.getMessage(), e);
        }
    }

    /**
     * Reconoce un rostro comparándolo con embeddings almacenados
     */
    public RecognizeFaceResponse recognizeFace(RecognizeFaceRequest request) {
        try {
            log.info("Sending face recognition request");

            String url = baseUrl + "/api/recognize";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<RecognizeFaceRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<RecognizeFaceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    RecognizeFaceResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                RecognizeFaceResponse result = response.getBody();
                log.info("Face recognition completed. Confidence: {}, Match: {}",
                        result.getConfidence(), result.isMatch());
                return result;
            } else {
                log.error("Face recognition failed with status: {}", response.getStatusCode());
                throw new RuntimeException("Face recognition failed");
            }

        } catch (Exception e) {
            log.error("Error during face recognition: {}", e.getMessage(), e);
            throw new RuntimeException("Error communicating with face recognition service: " + e.getMessage(), e);
        }
    }

    /**
     * Valida que una imagen contenga exactamente un rostro
     */
    public ValidateImageResponse validateImage(ValidateImageRequest request) {
        try {
            log.info("Validating image");

            String url = baseUrl + "/api/validate-image";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<ValidateImageRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<ValidateImageResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    ValidateImageResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                ValidateImageResponse result = response.getBody();
                log.info("Image validation completed. Valid: {}, Faces: {}",
                        result.isValid(), result.getFacesCount());
                return result;
            } else {
                log.error("Image validation failed with status: {}", response.getStatusCode());
                throw new RuntimeException("Image validation failed");
            }

        } catch (Exception e) {
            log.error("Error during image validation: {}", e.getMessage(), e);
            throw new RuntimeException("Error communicating with face recognition service: " + e.getMessage(), e);
        }
    }

    /**
     * Verifica si el servicio de reconocimiento facial está disponible
     */
    public boolean isServiceAvailable() {
        try {
            String url = baseUrl + "/";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            log.warn("Face recognition service is not available: {}", e.getMessage());
            return false;
        }
    }
}
