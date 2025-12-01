package com.example.asistencia.service;

import com.example.asistencia.dto.response.DashboardDto;

import java.time.LocalDate;

public interface DashboardService {
    DashboardDto getDashboardStats(LocalDate startDate, LocalDate endDate);
}
