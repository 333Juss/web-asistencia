package com.example.asistencia.controller;
import com.example.asistencia.dto.request.ColaboradorCreateDto;
import com.example.asistencia.dto.request.ColaboradorUpdateDto;
import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.dto.response.ColaboradorCreatedResponse;
import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.service.ColaboradorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colaboradores")
@Tag(name = "Colaboradores", description = "Gestión de colaboradores")
public class ColaboradorController {

    @Autowired
    private ColaboradorService colaboradorService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Listar colaboradores", description = "Obtiene todos los colaboradores con paginación")
    public ResponseEntity<ApiResponse<Page<Colaborador>>> getAllColaboradores(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(required = false) String search) {

        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Colaborador> colaboradores = search != null && !search.isEmpty()
                ? colaboradorService.searchColaboradores(search, pageable)
                : colaboradorService.getAllColaboradores(pageable);

        return ResponseEntity.ok(ApiResponse.success(colaboradores, "Colaboradores obtenidos correctamente"));
    }

    @GetMapping("/activos")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Listar colaboradores activos", description = "Obtiene todos los colaboradores activos")
    public ResponseEntity<ApiResponse<List<Colaborador>>> getColaboradoresActivos() {
        List<Colaborador> colaboradores = colaboradorService.getColaboradoresActivos();
        return ResponseEntity.ok(ApiResponse.success(colaboradores, "Colaboradores activos obtenidos"));
    }

    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Listar colaboradores por empresa", description = "Obtiene colaboradores de una empresa")
    public ResponseEntity<ApiResponse<List<Colaborador>>> getColaboradoresByEmpresa(@PathVariable Long empresaId) {
        List<Colaborador> colaboradores = colaboradorService.getColaboradoresByEmpresa(empresaId);
        return ResponseEntity.ok(ApiResponse.success(colaboradores, "Colaboradores de la empresa obtenidos"));
    }

    @GetMapping("/sede/{sedeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Listar colaboradores por sede", description = "Obtiene colaboradores de una sede")
    public ResponseEntity<ApiResponse<List<Colaborador>>> getColaboradoresBySede(@PathVariable Long sedeId) {
        List<Colaborador> colaboradores = colaboradorService.getColaboradoresBySede(sedeId);
        return ResponseEntity.ok(ApiResponse.success(colaboradores, "Colaboradores de la sede obtenidos"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Obtener colaborador por ID", description = "Obtiene un colaborador específico")
    public ResponseEntity<ApiResponse<Colaborador>> getColaboradorById(@PathVariable Long id) {
        Colaborador colaborador = colaboradorService.getColaboradorById(id);
        return ResponseEntity.ok(ApiResponse.success(colaborador, "Colaborador encontrado"));
    }

    @GetMapping("/dni/{dni}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Obtener colaborador por DNI", description = "Obtiene un colaborador por su DNI")
    public ResponseEntity<ApiResponse<Colaborador>> getColaboradorByDni(@PathVariable String dni) {
        Colaborador colaborador = colaboradorService.getColaboradorByDni(dni);
        return ResponseEntity.ok(ApiResponse.success(colaborador, "Colaborador encontrado"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    public ResponseEntity<ApiResponse<ColaboradorCreatedResponse>> createColaborador(
            @Valid @RequestBody ColaboradorCreateDto dto) {

        ColaboradorCreatedResponse response = colaboradorService.createColaboradorWithUser(dto);

        String mensaje = response.getUsuarioCreado()
                ? "Colaborador registrado exitosamente. Se creó usuario con acceso al sistema."
                : "Colaborador registrado exitosamente.";

        response.setMensaje(mensaje);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, mensaje));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Actualizar colaborador", description = "Actualiza un colaborador existente")
    public ResponseEntity<ApiResponse<Colaborador>> updateColaborador(
            @PathVariable Long id,
            @Valid @RequestBody ColaboradorUpdateDto dto) {
        dto.setId(id);
        Colaborador colaborador = colaboradorService.updateColaborador(id, dto);
        return ResponseEntity.ok(ApiResponse.success(colaborador, "Colaborador actualizado correctamente"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Eliminar colaborador", description = "Desactiva un colaborador (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteColaborador(@PathVariable Long id) {
        colaboradorService.deleteColaborador(id);
        return ResponseEntity.ok(ApiResponse.success("Colaborador eliminado correctamente"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Cambiar estado", description = "Activa o desactiva un colaborador")
    public ResponseEntity<ApiResponse<Colaborador>> toggleStatus(
            @PathVariable Long id,
            @RequestParam Boolean activo) {
        Colaborador colaborador = colaboradorService.toggleStatus(id, activo);
        return ResponseEntity.ok(ApiResponse.success(colaborador, "Estado actualizado correctamente"));
    }

    @GetMapping("/check-dni")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Verificar DNI", description = "Verifica si un DNI ya existe")
    public ResponseEntity<ApiResponse<Boolean>> checkDniExists(
            @RequestParam String dni,
            @RequestParam(required = false) Long excludeId) {
        Boolean exists = colaboradorService.checkDniExists(dni, excludeId);
        return ResponseEntity.ok(ApiResponse.success(exists, "Verificación completada"));
    }

    @GetMapping("/check-email")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Verificar email", description = "Verifica si un email ya existe")
    public ResponseEntity<ApiResponse<Boolean>> checkEmailExists(
            @RequestParam String email,
            @RequestParam(required = false) Long excludeId) {
        Boolean exists = colaboradorService.checkEmailExists(email, excludeId);
        return ResponseEntity.ok(ApiResponse.success(exists, "Verificación completada"));
    }

    @GetMapping("/estadisticas")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Obtener estadísticas", description = "Obtiene estadísticas de colaboradores")
    public ResponseEntity<ApiResponse<Object>> getEstadisticas() {
        Long totalActivos = colaboradorService.countActivos();
        Long conBiometria = colaboradorService.countConDatosBiometricos();

        var estadisticas = new Object() {
            //public final Long totalActivos =(5)Long;
            public final Long conDatosBiometricos = conBiometria;
            public final Long sinDatosBiometricos = totalActivos - conBiometria;
        };

        return ResponseEntity.ok(ApiResponse.success(estadisticas, "Estadísticas obtenidas"));
    }
}