package com.example.asistencia.service;

import com.example.asistencia.dto.response.ReportDto;
import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    List<ReportDto> generateAttendanceReport(LocalDate startDate, LocalDate endDate, Long colaboradorId);
}
