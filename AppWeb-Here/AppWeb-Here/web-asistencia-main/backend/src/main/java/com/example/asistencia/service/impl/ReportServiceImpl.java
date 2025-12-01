package com.example.asistencia.service.impl;

import com.example.asistencia.dto.response.ReportDto;
import com.example.asistencia.entity.Asistencia;
import com.example.asistencia.entity.Colaborador;
import com.example.asistencia.repository.AsistenciaRepository;
import com.example.asistencia.repository.ColaboradorRepository;
import com.example.asistencia.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final AsistenciaRepository asistenciaRepository;
    private final ColaboradorRepository colaboradorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ReportDto> generateAttendanceReport(LocalDate startDate, LocalDate endDate, Long colaboradorId) {
        List<Colaborador> colaboradores;
        if (colaboradorId != null) {
            colaboradores = colaboradorRepository.findById(colaboradorId)
                    .map(List::of)
                    .orElse(List.of());
        } else {
            colaboradores = colaboradorRepository.findAll();
        }

        List<ReportDto> reports = new ArrayList<>();

        for (Colaborador col : colaboradores) {
            // Obtener asistencias en el rango
            // Nota: Usamos el método paginado o creamos uno nuevo para lista completa.
            // Para reportes, generalmente queremos todo sin paginar, así que usaremos uno
            // nuevo en repo o filtraremos en memoria si no son muchos.
            // Mejor crear un método en repo para rango de fechas sin paginación.
            List<Asistencia> asistencias = asistenciaRepository.findByColaboradorIdAndFechaBetweenList(col.getId(),
                    startDate, endDate);

            ReportDto report = ReportDto.builder()
                    .colaboradorId(col.getId())
                    .nombreColaborador(col.getNombres() + " " + col.getApellidos())
                    .nombreSede(col.getSede() != null ? col.getSede().getNombre() : "Sin Sede")
                    .diasTrabajados(asistencias.size())
                    .totalHorasTrabajadas(asistencias.stream()
                            .mapToDouble(a -> a.getHorasTrabajadas() != null ? a.getHorasTrabajadas() : 0.0)
                            .sum())
                    .build();

            reports.add(report);
        }

        return reports;
    }
}
