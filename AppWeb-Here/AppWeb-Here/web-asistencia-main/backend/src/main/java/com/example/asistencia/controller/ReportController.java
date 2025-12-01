package com.example.asistencia.controller;

import com.example.asistencia.dto.response.ApiResponse;
import com.example.asistencia.dto.response.ReportDto;
import com.example.asistencia.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Endpoints para generación de reportes")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/attendance")
    @Operation(summary = "Reporte de asistencia", description = "Genera reporte de asistencia por rango de fechas")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getAttendanceReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long colaboradorId) {

        LocalDate start = startDate != null ? LocalDate.parse(startDate) : LocalDate.now().withDayOfMonth(1);
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : LocalDate.now();

        List<ReportDto> report = reportService.generateAttendanceReport(start, end, colaboradorId);
        return ResponseEntity.ok(ApiResponse.success(report, "Reporte generado exitosamente"));
    }
}
