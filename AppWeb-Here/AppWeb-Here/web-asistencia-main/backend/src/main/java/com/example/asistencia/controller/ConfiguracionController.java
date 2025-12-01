package com.example.asistencia.controller;

import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.entity.Configuracion;
import com.example.asistencia.service.ConfiguracionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracion")
@RequiredArgsConstructor
public class ConfiguracionController {

    private final ConfiguracionService configuracionService;

    @GetMapping
    public ResponseEntity<ApiResponse<Configuracion>> getConfiguracion() {
        Configuracion config = configuracionService.getConfiguracion();
        return ResponseEntity.ok(ApiResponse.success(config, "Configuración obtenida correctamente"));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Configuracion>> updateConfiguracion(@RequestBody Configuracion configuracion) {
        Configuracion updated = configuracionService.updateConfiguracion(configuracion);
        return ResponseEntity.ok(ApiResponse.success(updated, "Configuración actualizada correctamente"));
    }
}
