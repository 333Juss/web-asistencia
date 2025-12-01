package com.example.asistencia.controller;

import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.entity.Turno;
import com.example.asistencia.service.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/turnos")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    @GetMapping
    public ApiResponse<Page<Turno>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, name = "sort") List<String> sort
    ) {
        Sort sortObj = Sort.unsorted();

        if (sort != null && !sort.isEmpty()) {
            List<Sort.Order> orders = new ArrayList<>();
            for (String s : sort) {
                String[] parts = s.split(",");
                orders.add(new Sort.Order(
                        Sort.Direction.fromString(parts.length > 1 ? parts[1] : "asc"),
                        parts[0]
                ));
            }
            sortObj = Sort.by(orders);
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);
        return ApiResponse.success(turnoService.listarPaginado(search, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<Turno> obtener(@PathVariable Long id) {
        return ApiResponse.success(turnoService.obtenerPorId(id));
    }

    @PostMapping
    public ApiResponse<Turno> crear(@RequestBody Turno turno) {
        return ApiResponse.success(turnoService.crear(turno));
    }

    @PutMapping("/{id}")
    public ApiResponse<Turno> actualizar(@PathVariable Long id, @RequestBody Turno turno) {
        return ApiResponse.success(turnoService.actualizar(id, turno));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> eliminar(@PathVariable Long id) {
        turnoService.eliminar(id);
        return ApiResponse.success(null);
    }

    @PatchMapping("/{id}/estado")
    public ApiResponse<Turno> cambiarEstado(
            @PathVariable Long id,
            @RequestBody EstadoRequest req
    ) {
        return ApiResponse.success(turnoService.cambiarEstado(id, req.activo()));
    }

    public record EstadoRequest(boolean activo) {}
}