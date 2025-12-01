package com.example.asistencia.controller;

import com.example.asistencia.dto.JustificacionAccionDTO;
import com.example.asistencia.dto.JustificacionAccionRequest;
import com.example.asistencia.dto.JustificacionAdminDTO;
import com.example.asistencia.dto.JustificacionEnviarDTO;
import com.example.asistencia.entity.Justificacion;
import com.example.asistencia.service.JustificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/justificaciones")
@RequiredArgsConstructor
public class JustificacionController {

    private final JustificacionService justificacionService;

    // ============================================
    // ENVIAR JUSTIFICACIÓN (COLABORADOR)
    // ============================================
    @PostMapping("/{asistenciaId}/colaborador/{colaboradorId}")
    public Justificacion enviar(
            @PathVariable Long asistenciaId,
            @PathVariable Long colaboradorId,
            @RequestParam("motivo") String motivo,
            @RequestParam(value = "archivo", required = false) MultipartFile archivo
    ) {
        return justificacionService.enviarJustificacion(asistenciaId, colaboradorId, motivo, archivo);
    }




    // ============================================
    // APROBAR JUSTIFICACIÓN
    // ============================================
    @PutMapping("/{id}/aprobar")
    public JustificacionAccionDTO aprobar(
            @PathVariable Long id,
            @RequestBody JustificacionAccionRequest req) {

        return justificacionService.aprobar(id, req.getRespuestaSupervisor());
    }

    // ============================================
    // RECHAZAR JUSTIFICACIÓN
    // ============================================
    @PutMapping("/{id}/rechazar")
    public JustificacionAccionDTO rechazar(
            @PathVariable Long id,
            @RequestBody JustificacionAccionRequest req) {

        return justificacionService.rechazar(id, req.getRespuestaSupervisor());
    }

    // ============================================
    // LISTAR JUSTIFICACIONES DE UN COLABORADOR
    // ============================================
    @GetMapping("/colaborador/{colaboradorId}")
    public List<Justificacion> porColaborador(@PathVariable Long colaboradorId) {
        return justificacionService.listarPorColaborador(colaboradorId);
    }
    // ============================================
    // LISTAR TODAS LAS JUSTIFICACIONES
    //
    @GetMapping("/todas")
    public List<JustificacionAdminDTO> listarTodas() {
        return justificacionService.listarTodasDTO();
    }
}
