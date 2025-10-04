package com.example.asistencia.controller;
import com.example.asistencia.dto.request.EmpresaCreateDto;
import com.example.asistencia.dto.request.EmpresaUpdateDto;
import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.entity.Empresa;
import com.example.asistencia.service.EmpresaService;
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
@RequestMapping("/api/empresas")
@Tag(name = "Empresas", description = "Gestión de empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Listar empresas", description = "Obtiene todas las empresas con paginación")
    public ResponseEntity<ApiResponse<Page<Empresa>>> getAllEmpresas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(required = false) String search) {

        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Empresa> empresas = search != null && !search.isEmpty()
                ? empresaService.searchEmpresas(search, pageable)
                : empresaService.getAllEmpresas(pageable);

        return ResponseEntity.ok(ApiResponse.success(empresas, "Empresas obtenidas correctamente"));
    }

    @GetMapping("/activas")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Listar empresas activas", description = "Obtiene todas las empresas activas")
    public ResponseEntity<ApiResponse<List<Empresa>>> getEmpresasActivas() {
        List<Empresa> empresas = empresaService.getEmpresasActivas();
        return ResponseEntity.ok(ApiResponse.success(empresas, "Empresas activas obtenidas"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Obtener empresa por ID", description = "Obtiene una empresa específica por su ID")
    public ResponseEntity<ApiResponse<Empresa>> getEmpresaById(@PathVariable Long id) {
        Empresa empresa = empresaService.getEmpresaById(id);
        return ResponseEntity.ok(ApiResponse.success(empresa, "Empresa encontrada"));
    }

    @GetMapping("/ruc/{ruc}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Obtener empresa por RUC", description = "Obtiene una empresa por su RUC")
    public ResponseEntity<ApiResponse<Empresa>> getEmpresaByRuc(@PathVariable String ruc) {
        Empresa empresa = empresaService.getEmpresaByRuc(ruc);
        return ResponseEntity.ok(ApiResponse.success(empresa, "Empresa encontrada"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear empresa", description = "Crea una nueva empresa")
    public ResponseEntity<ApiResponse<Empresa>> createEmpresa(@Valid @RequestBody EmpresaCreateDto dto) {
        Empresa empresa = empresaService.createEmpresa(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(empresa, "Empresa creada correctamente"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar empresa", description = "Actualiza una empresa existente")
    public ResponseEntity<ApiResponse<Empresa>> updateEmpresa(
            @PathVariable Long id,
            @Valid @RequestBody EmpresaUpdateDto dto) {
        dto.setId(id);
        Empresa empresa = empresaService.updateEmpresa(id, dto);
        return ResponseEntity.ok(ApiResponse.success(empresa, "Empresa actualizada correctamente"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar empresa", description = "Desactiva una empresa (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteEmpresa(@PathVariable Long id) {
        empresaService.deleteEmpresa(id);
        return ResponseEntity.ok(ApiResponse.success("Empresa eliminada correctamente"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cambiar estado", description = "Activa o desactiva una empresa")
    public ResponseEntity<ApiResponse<Empresa>> toggleStatus(
            @PathVariable Long id,
            @RequestParam Boolean activo) {
        Empresa empresa = empresaService.toggleStatus(id, activo);
        return ResponseEntity.ok(ApiResponse.success(empresa, "Estado actualizado correctamente"));
    }

    @GetMapping("/check-ruc")
    @PreAuthorize("hasAnyRole('ADMIN', 'RRHH')")
    @Operation(summary = "Verificar RUC", description = "Verifica si un RUC ya existe")
    public ResponseEntity<ApiResponse<Boolean>> checkRucExists(@RequestParam String ruc) {
        Boolean exists = empresaService.existsByRuc(ruc);
        return ResponseEntity.ok(ApiResponse.success(exists, "Verificación completada"));
    }
}