package com.example.asistencia.controller;
import com.example.asistencia.dto.request.SedeCreateDto;
import com.example.asistencia.dto.request.SedeUpdateDto;
import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.entity.Sede;
import com.example.asistencia.service.SedeService;
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
@RequestMapping("/api/sedes")
@Tag(name = "Sedes", description = "Gestión de sedes")
public class SedeController {

    @Autowired
    private SedeService sedeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Listar sedes", description = "Obtiene todas las sedes con paginación")
    public ResponseEntity<ApiResponse<Page<Sede>>> getAllSedes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(required = false) String search) {

        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Sede> sedes = search != null && !search.isEmpty()
                ? sedeService.searchSedes(search, pageable)
                : sedeService.getAllSedes(pageable);

        return ResponseEntity.ok(ApiResponse.success(sedes, "Sedes obtenidas correctamente"));
    }

    @GetMapping("/activas")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH', 'EMPLEADO')")
    @Operation(summary = "Listar sedes activas", description = "Obtiene todas las sedes activas")
    public ResponseEntity<ApiResponse<List<Sede>>> getSedesActivas() {
        List<Sede> sedes = sedeService.getSedesActivas();
        return ResponseEntity.ok(ApiResponse.success(sedes, "Sedes activas obtenidas"));
    }

    @GetMapping("/empresa/{empresaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Listar sedes por empresa", description = "Obtiene todas las sedes de una empresa")
    public ResponseEntity<ApiResponse<List<Sede>>> getSedesByEmpresa(@PathVariable Long empresaId) {
        List<Sede> sedes = sedeService.getSedesByEmpresa(empresaId);
        return ResponseEntity.ok(ApiResponse.success(sedes, "Sedes de la empresa obtenidas"));
    }

    @GetMapping("/empresa/{empresaId}/activas")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH', 'EMPLEADO')")
    @Operation(summary = "Listar sedes activas por empresa", description = "Obtiene sedes activas de una empresa")
    public ResponseEntity<ApiResponse<List<Sede>>> getSedesActivasByEmpresa(@PathVariable Long empresaId) {
        List<Sede> sedes = sedeService.getSedesActivasByEmpresa(empresaId);
        return ResponseEntity.ok(ApiResponse.success(sedes, "Sedes activas de la empresa obtenidas"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Obtener sede por ID", description = "Obtiene una sede específica por su ID")
    public ResponseEntity<ApiResponse<Sede>> getSedeById(@PathVariable Long id) {
        Sede sede = sedeService.getSedeById(id);
        return ResponseEntity.ok(ApiResponse.success(sede, "Sede encontrada"));
    }

    @GetMapping("/codigo/{codigo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Obtener sede por código", description = "Obtiene una sede por su código")
    public ResponseEntity<ApiResponse<Sede>> getSedeByCodigo(@PathVariable String codigo) {
        Sede sede = sedeService.getSedeByCodigo(codigo);
        return ResponseEntity.ok(ApiResponse.success(sede, "Sede encontrada"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear sede", description = "Crea una nueva sede")
    public ResponseEntity<ApiResponse<Sede>> createSede(@Valid @RequestBody SedeCreateDto dto) {
        Sede sede = sedeService.createSede(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(sede, "Sede creada correctamente"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar sede", description = "Actualiza una sede existente")
    public ResponseEntity<ApiResponse<Sede>> updateSede(
            @PathVariable Long id,
            @Valid @RequestBody SedeUpdateDto dto) {
        dto.setId(id);
        Sede sede = sedeService.updateSede(id, dto);
        return ResponseEntity.ok(ApiResponse.success(sede, "Sede actualizada correctamente"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar sede", description = "Desactiva una sede (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteSede(@PathVariable Long id) {
        sedeService.deleteSede(id);
        return ResponseEntity.ok(ApiResponse.success("Sede eliminada correctamente"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cambiar estado", description = "Activa o desactiva una sede")
    public ResponseEntity<ApiResponse<Sede>> toggleStatus(
            @PathVariable Long id,
            @RequestParam Boolean activo) {
        Sede sede = sedeService.toggleStatus(id, activo);
        return ResponseEntity.ok(ApiResponse.success(sede, "Estado actualizado correctamente"));
    }

    @GetMapping("/check-codigo")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Verificar código", description = "Verifica si un código de sede ya existe")
    public ResponseEntity<ApiResponse<Boolean>> checkCodigoExists(@RequestParam String codigo) {
        Boolean exists = sedeService.existsByCodigo(codigo);
        return ResponseEntity.ok(ApiResponse.success(exists, "Verificación completada"));
    }

    @GetMapping("/validar-ubicacion")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH', 'EMPLEADO')")
    @Operation(summary = "Validar ubicación", description = "Valida si una ubicación está dentro del radio de una sede")
    public ResponseEntity<ApiResponse<Boolean>> validarUbicacion(
            @RequestParam double latitud,
            @RequestParam double longitud,
            @RequestParam Long sedeId) {
        boolean dentroDelRadio = sedeService.validarUbicacion(latitud, longitud, sedeId);
        return ResponseEntity.ok(ApiResponse.success(dentroDelRadio,
                dentroDelRadio ? "Ubicación válida" : "Fuera del radio permitido"));
    }
}