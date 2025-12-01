package com.example.asistencia.service.impl;

import com.example.asistencia.dto.response.DashboardDto;
import com.example.asistencia.entity.enums.EstadoAsistencia;
import com.example.asistencia.repository.AsistenciaRepository;
import com.example.asistencia.repository.ColaboradorRepository;
import com.example.asistencia.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ColaboradorRepository colaboradorRepository;
    private final AsistenciaRepository asistenciaRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardDto getDashboardStats(LocalDate startDate, LocalDate endDate) {
        if (startDate == null)
            startDate = LocalDate.now();
        if (endDate == null)
            endDate = LocalDate.now();

        // Total colaboradores activos
        long totalColaboradores = colaboradorRepository.countActivos();

        // Asistencias en rango (Presentes: COMPLETA, INCOMPLETA, TARDANZA)
        List<EstadoAsistencia> presentesEstados = Arrays.asList(
                EstadoAsistencia.COMPLETA,
                EstadoAsistencia.INCOMPLETA,
                EstadoAsistencia.TARDANZA);

        // Count total attendances in range
        List<Object[]> statsInRange = asistenciaRepository.countByFechaBetweenAndEstadoIn(startDate, endDate,
                presentesEstados);
        long asistenciasCount = statsInRange.stream().mapToLong(row -> (Long) row[1]).sum();

        // Tardanzas en rango
        // We need a method for this or filter the generic query.
        // Let's use the generic query for all stats to be efficient?
        // Actually, let's keep it simple. We need total tardanzas in range.
        // We don't have a direct method for total tardanzas in range in repo yet, but
        // we can infer or add one.
        // Let's add a simple loop or stream if we fetch all? No, better to query DB.
        // For now, let's assume we need to add a method or use existing.
        // We added countByFechaBetweenAndEstadoIn which groups by date.

        // Let's use a new repository method for efficiency if possible, or just
        // iterate.
        // Wait, I can't add repo methods here. I should have added it in the plan.
        // I'll use what I have. I can filter `statsInRange` if I had breakdown by
        // status, but I only have breakdown by date for "Presentes".

        // Let's calculate Tardanzas by querying specifically for TARDANZA in range.
        // I need to add `countByFechaBetweenAndEstado` to repo?
        // Or I can just use `countByFechaBetweenAndEstadoIn` with just TARDANZA.
        List<Object[]> tardanzasStats = asistenciaRepository.countByFechaBetweenAndEstadoIn(startDate, endDate,
                Arrays.asList(EstadoAsistencia.TARDANZA));
        long tardanzasCount = tardanzasStats.stream().mapToLong(row -> (Long) row[1]).sum();

        // Ausencias
        // Logic: (Total Active * Days in Range) - Asistencias
        long daysInRange = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        long totalExpected = totalColaboradores * daysInRange;
        long ausenciasCount = totalExpected - asistenciasCount;
        if (ausenciasCount < 0)
            ausenciasCount = 0;

        // Chart Data: Asistencia por Estado
        java.util.Map<String, Long> asistenciaPorEstado = new java.util.HashMap<>();
        asistenciaPorEstado.put("A Tiempo", asistenciasCount - tardanzasCount);
        asistenciaPorEstado.put("Tardanzas", tardanzasCount);
        asistenciaPorEstado.put("Ausencias", ausenciasCount);

        // Chart Data: Asistencia Por Día (Trend)
        java.util.Map<String, Long> asistenciaPorDia = new java.util.LinkedHashMap<>();

        // Initialize all days in range with 0
        for (int i = 0; i < daysInRange; i++) {
            asistenciaPorDia.put(startDate.plusDays(i).toString(), 0L);
        }

        // Fill with data
        for (Object[] row : statsInRange) {
            LocalDate date = (LocalDate) row[0];
            Long count = (Long) row[1];
            asistenciaPorDia.put(date.toString(), count);
        }

        return DashboardDto.builder()
                .totalColaboradores(totalColaboradores)
                .asistenciasCount(asistenciasCount)
                .tardanzasCount(tardanzasCount)
                .ausenciasCount(ausenciasCount)
                .asistenciaPorEstado(asistenciaPorEstado)
                .asistenciaPorDia(asistenciaPorDia)
                .build();
    }
}
