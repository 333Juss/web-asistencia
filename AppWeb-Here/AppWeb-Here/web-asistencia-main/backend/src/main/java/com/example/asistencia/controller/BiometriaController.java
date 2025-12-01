package com.example.asistencia.controller;

import com.example.asistencia.dto.request.CapturarRostroDto;
import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.dto.response.RegistroBiometricoResponse;
import com.example.asistencia.entity.DatosBiometricos;
import com.example.asistencia.service.BiometriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/biometria")
@RequiredArgsConstructor
@Tag(name = "Biometría", description = "Endpoints para gestión de datos biométricos")
public class BiometriaController {

    private final BiometriaService biometriaService;

    @PostMapping("/capturar-rostro")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH', 'EMPLEADO')")
    @Operation(summary = "Capturar y registrar rostros", description = "Registra múltiples imágenes faciales de un colaborador")
    public ResponseEntity<ApiResponse<RegistroBiometricoResponse>> capturarRostro(
            @Valid @RequestBody CapturarRostroDto dto
    ) {
        log.info("POST /api/biometria/capturar-rostro - Colaborador ID: {}", dto.getColaboradorId());

        RegistroBiometricoResponse response = biometriaService.capturarRostro(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Registro biométrico completado exitosamente"));
    }

    @GetMapping("/colaborador/{colaboradorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Obtener datos biométricos", description = "Obtiene los datos biométricos de un colaborador")
    public ResponseEntity<ApiResponse<List<DatosBiometricos>>> obtenerDatosBiometricos(
            @PathVariable Long colaboradorId
    ) {
        log.info("GET /api/biometria/colaborador/{} - Obteniendo datos biométricos", colaboradorId);

        List<DatosBiometricos> datos = biometriaService.obtenerDatosBiometricos(colaboradorId);

        return ResponseEntity.ok(ApiResponse.success(datos, "Datos biométricos obtenidos exitosamente"));
    }

    @DeleteMapping("/colaborador/{colaboradorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Eliminar datos biométricos", description = "Elimina todos los datos biométricos de un colaborador")
    public ResponseEntity<ApiResponse<Void>> eliminarDatosBiometricos(
            @PathVariable Long colaboradorId
    ) {
        log.info("DELETE /api/biometria/colaborador/{} - Eliminando datos biométricos", colaboradorId);

        biometriaService.eliminarDatosBiometricos(colaboradorId);

        return ResponseEntity.ok(ApiResponse.success(null, "Datos biométricos eliminados exitosamente"));
    }

    @GetMapping("/colaborador/{colaboradorId}/check")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH', 'EMPLEADO')")
    @Operation(summary = "Verificar si el colaborador tiene datos biométricos registrados")
    public ResponseEntity<ApiResponse<?>> verificarDatosBiometricos(
            @PathVariable Long colaboradorId
    ) {
        log.info("GET /api/biometria/colaborador/{}/check - Verificando datos biométricos", colaboradorId);

        boolean tieneDatos = biometriaService.tieneDatosBiometricos(colaboradorId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        Map.of(
                                "colaboradorId", colaboradorId,
                                "tieneDatos", tieneDatos
                        ),
                        "Estado biométrico obtenido correctamente"
                )
        );
    }

}
