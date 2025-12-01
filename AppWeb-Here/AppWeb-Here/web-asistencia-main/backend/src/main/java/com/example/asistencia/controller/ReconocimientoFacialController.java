package com.example.asistencia.controller;

import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.dto.response.ReconocimientoFacialResponse;
import com.example.asistencia.service.ReconocimientoFacialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/reconocimiento")
@RequiredArgsConstructor
@Tag(name = "Reconocimiento Facial", description = "Endpoints para reconocimiento facial")
public class ReconocimientoFacialController {

    private final ReconocimientoFacialService reconocimientoFacialService;

    @PostMapping("/verificar")
    @Operation(summary = "Verificar rostro", description = "Verifica si el rostro enviado coincide con el del colaborador")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verificarRostro(@RequestBody Map<String, Object> payload) {
        try {
            Long colaboradorId = ((Number) payload.get("colaboradorId")).longValue();
            String imagenBase64 = (String) payload.get("imagenBase64");

            log.info("Verificando rostro para colaborador ID: {}", colaboradorId);

            double confidence = reconocimientoFacialService.reconocerRostro(colaboradorId, imagenBase64);
            boolean match = confidence >= 0.80; // Umbral por defecto

            Map<String, Object> response = Map.of(
                    "coincide", match,
                    "confianza", confidence,
                    "mensaje", match ? "Rostro verificado correctamente" : "No se pudo verificar la identidad");

            return ResponseEntity.ok(ApiResponse.success(response, "Proceso de verificación completado"));
        } catch (Exception e) {
            log.error("Error en verificarRostro: ", e);
            // Retornar 200 con mensaje de error para depuración en frontend
            return ResponseEntity
                    .ok(ApiResponse.error("DEBUG ERROR BACKEND: " + e.getMessage() + " | " + e.getClass().getName()));
        }
    }
}
