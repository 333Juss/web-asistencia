package com.example.asistencia.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Endpoints para verificar el estado del sistema")
public class HealthController {

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping
    @Operation(summary = "Verificar estado del sistema", description = "Retorna información básica del sistema")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", applicationName);
        response.put("profile", activeProfile);
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Sistema de Asistencia funcionando correctamente");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/version")
    @Operation(summary = "Obtener versión", description = "Retorna la versión de la API")
    public ResponseEntity<Map<String, String>> version() {
        Map<String, String> response = new HashMap<>();
        response.put("version", "1.0.0");
        response.put("build", "2024-01-01");

        return ResponseEntity.ok(response);
    }
}