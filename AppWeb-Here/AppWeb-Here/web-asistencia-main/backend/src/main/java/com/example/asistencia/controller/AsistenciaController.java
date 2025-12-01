package com.example.asistencia.controller;

import com.example.asistencia.dto.InasistenciaDTO;
import com.example.asistencia.dto.request.MarcarEntradaDto;
import com.example.asistencia.dto.request.MarcarSalidaDto;
import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.dto.response.AsistenciaResponse;
import com.example.asistencia.service.AsistenciaService;
import com.example.asistencia.service.GeneradorFaltasService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/asistencia")
@RequiredArgsConstructor
@Tag(name = "Asistencia", description = "Endpoints para gestión de asistencias")
public class AsistenciaController {

    private final AsistenciaService asistenciaService;
    private final GeneradorFaltasService generadorFaltasService;

    // ------------------------------------------------------------
    // MARCAR ENTRADA
    // ------------------------------------------------------------
    @PostMapping("/entrada")
    @Operation(summary = "Marcar entrada")
    public ResponseEntity<ApiResponse<AsistenciaResponse>> marcarEntrada(@Valid @RequestBody MarcarEntradaDto dto) {
        AsistenciaResponse response = asistenciaService.marcarEntrada(dto);
        return ResponseEntity.ok(ApiResponse.success(response, "Entrada registrada exitosamente"));
    }

    // ------------------------------------------------------------
    // MARCAR SALIDA
    // ------------------------------------------------------------
    @PostMapping("/salida")
    @Operation(summary = "Marcar salida")
    public ResponseEntity<ApiResponse<AsistenciaResponse>> marcarSalida(@Valid @RequestBody MarcarSalidaDto dto) {
        AsistenciaResponse response = asistenciaService.marcarSalida(dto);
        return ResponseEntity.ok(ApiResponse.success(response, "Salida registrada exitosamente"));
    }

    // ------------------------------------------------------------
    // OBTENER ASISTENCIA HOY
    // ------------------------------------------------------------
    @GetMapping("/hoy/{colaboradorId}")
    public ResponseEntity<ApiResponse<AsistenciaResponse>> getAsistenciaHoy(@PathVariable Long colaboradorId) {
        AsistenciaResponse response = asistenciaService.getAsistenciaHoy(colaboradorId);
        return ResponseEntity.ok(ApiResponse.success(response, "Asistencia de hoy obtenida"));
    }

    // ------------------------------------------------------------
    // HISTORIAL
    // ------------------------------------------------------------
    @GetMapping("/colaborador/{colaboradorId}")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<AsistenciaResponse>>> getAsistenciasColaborador(
            @PathVariable Long colaboradorId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "fecha,desc") String[] sort) {

        LocalDate start = startDate != null ? LocalDate.parse(startDate)
                : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();

        org.springframework.data.domain.Pageable pageable =
                org.springframework.data.domain.PageRequest.of(
                        page,
                        size,
                        org.springframework.data.domain.Sort.by(
                                org.springframework.data.domain.Sort.Direction.fromString(sort[1]),
                                sort[0]
                        )
                );

        var response = asistenciaService.getAsistenciasColaborador(colaboradorId, start, end, pageable);

        return ResponseEntity.ok(ApiResponse.success(response, "Historial obtenido exitosamente"));
    }

    // ------------------------------------------------------------
    // RESUMEN
    // ------------------------------------------------------------
    @GetMapping("/colaborador/{colaboradorId}/resumen")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH', 'EMPLEADO')")
    public ResponseEntity<ApiResponse<?>> obtenerResumenAsistencia(@PathVariable Long colaboradorId) {
        return ResponseEntity.ok(
                ApiResponse.success(asistenciaService.obtenerResumen(colaboradorId), "Resumen obtenido")
        );
    }

    // ------------------------------------------------------------
    // INASISTENCIAS BASICAS (FALTAS, PENDIENTE y JUSTIFICADAS)
    // SIN JUSTIFICACION DETALLADA
    // ------------------------------------------------------------
    @GetMapping("/inasistencias/simple/{colaboradorId}")
    public ResponseEntity<ApiResponse<List<AsistenciaResponse>>> getInasistencias(@PathVariable Long colaboradorId) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        asistenciaService.listarInasistencias(colaboradorId),
                        "Inasistencias obtenidas"
                )
        );
    }

    // ------------------------------------------------------------
    // INASISTENCIAS + ESTADO DE JUSTIFICACION (lo que necesita el frontend)
    // ------------------------------------------------------------
    @GetMapping("/inasistencias/{colaboradorId}/con-justificacion")
    public ApiResponse<List<InasistenciaDTO>> listarInasistenciasConJustificacion(
            @PathVariable Long colaboradorId) {

        List<InasistenciaDTO> lista =
                asistenciaService.listarInasistenciasConJustificacion(colaboradorId);

        return ApiResponse.success(lista, "Inasistencias con justificación obtenidas correctamente");
    }

    // ------------------------------------------------------------
    // GENERAR FALTAS MANUALMENTE
    // ------------------------------------------------------------
    @PostMapping("/generar-faltas-hoy")
    public ResponseEntity<?> generarFaltasHoy() {
        generadorFaltasService.generarFaltas(LocalDate.now());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Faltas generadas manualmente"
        ));
    }
}